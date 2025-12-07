import React, { useState, Fragment } from 'react';
import { UploadStep } from './UploadStep';
import { ColumnMappingStep } from './ColumnMappingStep';
import { ValidationReport } from './ValidationReport';
import { ImportSummary } from './ImportSummary';
import {
  parseCSV,
  validateRow,
  ValidationResult,
  ValidationSummary,
  BulkUser,
  parseXLSX,
  generateCSVTemplate,
  generateXLSXTemplate,
  downloadFile
} from '@/utils/bulkUploadHelpers';
import { useFindDistrict } from '@/utils/useFindDistrict';
import { useFindOffice } from '@/utils/useFindOffice';
import { useFindPositionType } from '@/utils/useFindPositionType';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAuthStore } from '@/auth/store/auth.store';
type Step = 'upload' | 'mapping' | 'validation' | 'summary';

interface BulkUploadTabProps {
  onComplete: () => void;
}

export function BulkUploadTab({ onComplete }: BulkUploadTabProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary>({
    total: 0,
    ok: 0,
    warnings: 0,
    errors: 0,
  });
  const [importSummary, setImportSummary] = useState({
    created: 0,
    updated: 0,
    skipped: 0,
    duration: 0,
  });
  const [isImporting, setIsImporting] = useState(false);

  const { user } = useAuthStore();
  const { findDistrictIdByName } = useFindDistrict();
  const { findOfficeIdByName } = useFindOffice();
  const { findPositionTypeIdByName } = useFindPositionType();
  // const { findStatusEmployeeIdByName } = useFindStatusEmployeeByName();
  const { createEmployee } = useEmployees({});

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    if (file) {
      let parsed: BulkUser[] = [];
      if (file.name.endsWith('.csv')) {
        const content = await file.text();
        parsed = parseCSV(content);
      } else if (file.name.endsWith('.xlsx')) {
        parsed = await parseXLSX(file);
      }

      if (parsed.length > 0) {
        const columns = Object.keys(parsed[0]);
        setFileColumns(columns);
        setPreviewData(parsed);
      }
    }
  };

  const handleDownloadTemplate = (format: 'csv' | 'xlsx') => {
    if (format === 'csv') {
      const csvContent = generateCSVTemplate();
      downloadFile(csvContent, 'plantilla_empleados.csv', 'text/csv;charset=utf-8;');
    } else {
      const blob = generateXLSXTemplate();
      downloadFile(URL.createObjectURL(blob), 'plantilla_empleados.xlsx', 'application/octet-stream');
    }
  };

  const handleContinueFromUpload = () => {
    if (selectedFile) {
      setCurrentStep('mapping');
    }
  };

  const handleMappingChange = (newMapping: Record<string, string>) => {
    setMapping(newMapping);
  };

  const handleValidate = () => {
    console.log(`previewData: `, previewData)

    const mappedData: BulkUser[] = previewData.map(row => {
      const user: any = {};
      Object.keys(mapping).forEach(systemField => {
        const fileColumn = mapping[systemField];
        if (fileColumn) {
          user[systemField] = row[fileColumn];
        }
      });
      return user as BulkUser;
    });

    const results = mappedData.map((user, idx) =>
      validateRow(user, idx, {
        findDistrictId: findDistrictIdByName,
        findOfficeId: findOfficeIdByName,
        findPositionTypeId: findPositionTypeIdByName,
        // findstatus: findStatusEmployeeIdByName,
      })
    );

    const summary: ValidationSummary = {
      total: results.length,
      ok: results.filter(r => r.status === 'ok').length,
      warnings: results.filter(r => r.status === 'warning').length,
      errors: results.filter(r => r.status === 'error').length,
    };

    setValidationResults(results);
    setValidationSummary(summary);
    setCurrentStep('validation');
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    const startTime = Date.now();
    let createdCount = 0;

    const validRecords = validationResults.filter(r => r.status !== 'error');

    for (const result of validRecords) {
      try {
        const employeeData = {
          full_name: result.data.nombre_completo,
          dpi: result.data.dpi,
          birth_date: null,
          phone: result.data.telefono,
          email: result.data.email,

          digessp_fecha_vencimiento: null,

          office_id: result.data.oficina_id,
          district_id: result.data.distrito_id,
          admin_position_id: result.data.cargo_administrativo_id,
          operative_position_id: result.data.cargo_operativo_id,

          salary: result.data.sueldo_inicial,
          bonus: result.data.bonificaciones,

          user_id: user?.id,
          user_responsible_id: null,
          files: [],
          description_files: '',

        };
        const response = await createEmployee(employeeData);
        result.created = {
          status: 200,
          success: true,
          message: "Empleado creado",
          data: response,
        };
        createdCount++;
      } catch (error: any) {
        result.created = {
          status: 400,
          success: false,
          message: error?.message ?? "Error al crear",
        };
      }
      await new Promise(r => setTimeout(r, 1500));
    }
    console.log(`validRecords: ${validRecords}`)
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    setImportSummary({
      created: createdCount,
      updated: 0,
      skipped: validationSummary.errors + (validRecords.length - createdCount),
      duration: parseFloat(duration),
    });

    setIsImporting(false);
    setCurrentStep('summary');
  };

  const handleBackToMapping = () => {
    setCurrentStep('mapping');
  };

  const handleFinish = () => {
    onComplete();
  };

  const steps = [
    { id: 'upload', label: 'Subir archivo', number: 1 },
    { id: 'mapping', label: 'Mapeo de columnas', number: 2 },
    { id: 'validation', label: 'Validación', number: 3 },
    { id: 'summary', label: 'Confirmación', number: 4 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const validRecords = validationResults.filter(r => r.status !== 'error');
  console.log(`validRecords: `, validRecords)
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index <= currentStepIndex ? 'bg-[#cf2e2e] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {step.number}
                </div>
                <span className={`font-medium text-sm ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${index < currentStepIndex ? 'bg-[#cf2e2e]' : 'bg-gray-200'}`} />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {currentStep === 'upload' && (
          <UploadStep
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onDownloadTemplate={handleDownloadTemplate}
          />
        )}
        {currentStep === 'mapping' && (
          <ColumnMappingStep
            fileColumns={fileColumns}
            previewData={previewData}
            onMappingChange={handleMappingChange}
            onValidate={handleValidate}
          />
        )}
        {currentStep === 'validation' && (
          <ValidationReport
            results={validationResults}
            summary={validationSummary}
            onBack={handleBackToMapping}
            onConfirm={handleConfirmImport}
            isImporting={isImporting}
          />
        )}
        {currentStep === 'summary' && <ImportSummary {...importSummary} onFinish={handleFinish} />}
      </div>

      <div className="flex justify-between">
        {currentStep !== 'upload' && currentStep !== 'summary' && (
          <button
            onClick={() => {
              if (currentStep === 'mapping') setCurrentStep('upload');
              if (currentStep === 'validation') setCurrentStep('mapping');
            }}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Volver
          </button>
        )}
        {currentStep === 'upload' && (
          <div className="ml-auto">
            <button
              onClick={handleContinueFromUpload}
              disabled={!selectedFile}
              className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}
        {currentStep === 'mapping' && (
          <div className="ml-auto">
            <button
              onClick={handleValidate}
              className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium"
            >
              Validar datos
            </button>
          </div>
        )}
        {currentStep === 'validation' && (
          <div className="ml-auto flex space-x-3">
            <button
              onClick={handleBackToMapping}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Volver al mapeo
            </button>
            {/* <button
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium disabled:opacity-50"
            >
              {isImporting ? 'Importando...' : 'Confirmar importación'}
            </button> */}
            <button
              onClick={handleConfirmImport}
              disabled={isImporting || validationResults.filter(r => r.status !== 'error').length === 0}
              className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium 
             disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
              )}
              {isImporting ? 'Importando...' : 'Confirmar importación'}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}