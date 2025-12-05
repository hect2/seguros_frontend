import React, { useState, Fragment } from 'react';
import { UploadStep } from './UploadStep';
import { ColumnMappingStep } from './ColumnMappingStep';
import { ValidationReport } from './ValidationReport';
import { ImportSummary } from './ImportSummary';
import { parseCSV, validateRow, ValidationResult, ValidationSummary, BulkUser } from '@/utils/bulkUploadHelpers';
// import {  } from '../../../utils/bulkUploadHelpers';
type Step = 'upload' | 'mapping' | 'validation' | 'summary';
interface BulkUploadTabProps {
  onComplete: () => void;
}
export function BulkUploadTab({
  onComplete
}: BulkUploadTabProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateIfExists, setUpdateIfExists] = useState(false);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary>({
    total: 0,
    ok: 0,
    warnings: 0,
    errors: 0
  });
  const [importSummary, setImportSummary] = useState({
    created: 0,
    updated: 0,
    skipped: 0,
    duration: 0
  });
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        const parsed = parseCSV(content);
        if (parsed.length > 0) {
          const columns = Object.keys(parsed[0]);
          setFileColumns(columns);
          setPreviewData(parsed);
        }
      };
      reader.readAsText(file);
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
    // Map preview data to BulkUser format
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
    // Validate each row
    const results = mappedData.map((user, idx) => validateRow(user, idx, 'Admin'));
    // Calculate summary
    const summary: ValidationSummary = {
      total: results.length,
      ok: results.filter(r => r.status === 'ok').length,
      warnings: results.filter(r => r.status === 'warning').length,
      errors: results.filter(r => r.status === 'error').length
    };
    setValidationResults(results);
    setValidationSummary(summary);
    setCurrentStep('validation');
  };
  const handleConfirmImport = () => {
    // Mock import process
    const startTime = Date.now();
    setTimeout(() => {
      const validRecords = validationResults.filter(r => r.status !== 'error');
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      setImportSummary({
        created: updateIfExists ? Math.floor(validRecords.length * 0.7) : validRecords.length,
        updated: updateIfExists ? Math.floor(validRecords.length * 0.3) : 0,
        skipped: validationSummary.errors,
        duration: parseFloat(duration)
      });
      setCurrentStep('summary');
    }, 2000);
  };
  const handleBackToMapping = () => {
    setCurrentStep('mapping');
  };
  const handleFinish = () => {
    onComplete();
  };
  const steps = [{
    id: 'upload',
    label: 'Subir archivo',
    number: 1
  }, {
    id: 'mapping',
    label: 'Mapeo de columnas',
    number: 2
  }, {
    id: 'validation',
    label: 'Validación',
    number: 3
  }, {
    id: 'summary',
    label: 'Confirmación',
    number: 4
  }];
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  return <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => <Fragment key={step.id}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index <= currentStepIndex ? 'bg-[#cf2e2e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step.number}
                </div>
                <span className={`font-medium text-sm ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${index < currentStepIndex ? 'bg-[#cf2e2e]' : 'bg-gray-200'}`} />}
            </Fragment>)}
        </div>
      </div>
      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {currentStep === 'upload' && <UploadStep onFileSelect={handleFileSelect} selectedFile={selectedFile} updateIfExists={updateIfExists} onUpdateIfExistsChange={setUpdateIfExists} />}
        {currentStep === 'mapping' && <ColumnMappingStep fileColumns={fileColumns} previewData={previewData} onMappingChange={handleMappingChange} onValidate={handleValidate} />}
        {currentStep === 'validation' && <ValidationReport results={validationResults} summary={validationSummary} onBack={handleBackToMapping} onConfirm={handleConfirmImport} />}
        {currentStep === 'summary' && <ImportSummary created={importSummary.created} updated={importSummary.updated} skipped={importSummary.skipped} duration={importSummary.duration} onFinish={handleFinish} />}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {currentStep !== 'upload' && currentStep !== 'summary' && <button onClick={() => {
        if (currentStep === 'mapping') setCurrentStep('upload');
        if (currentStep === 'validation') setCurrentStep('mapping');
      }} className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
            Volver
          </button>}
        {currentStep === 'upload' && <div className="ml-auto">
            <button onClick={handleContinueFromUpload} disabled={!selectedFile} className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Continuar
            </button>
          </div>}
        {currentStep === 'mapping' && <div className="ml-auto">
            <button onClick={handleValidate} className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
              Validar datos
            </button>
          </div>}
        {currentStep === 'validation' && <div className="ml-auto flex space-x-3">
            <button onClick={handleBackToMapping} className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
              Volver al mapeo
            </button>
            <button onClick={handleConfirmImport} className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
              Confirmar importación
            </button>
          </div>}
      </div>
    </div>;
}