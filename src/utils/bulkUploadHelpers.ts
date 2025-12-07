import * as XLSX from 'xlsx';

export interface BulkUser {
  nombre_completo: string;
  dpi: string;
  email: string;
  distrito: string;
  oficina: string;
  cargo_administrativo?: string;
  cargo_operativo?: string;
  telefono?: string;
  sueldo_inicial?: number;
  bonificaciones?: number;
}

export interface ValidationResult {
  row: number;
  status: 'ok' | 'warning' | 'error';
  messages: string[];
  data: BulkUser & {
    distrito_id?: number | null;
    oficina_id?: number | null;
    cargo_administrativo_id?: number | null;
    cargo_operativo_id?: number | null;
  };
  created?: {
    status: number;
    success: boolean;
    message: string;
  }
}

export interface ValidationSummary {
  total: number;
  ok: number;
  warnings: number;
  errors: number;
}

interface ValidationOptions {
  findDistrictId: (name: string) => number | null;
  findOfficeId: (name: string) => number | null;
  findPositionTypeId: (name: string) => number | null;
}

export function validateRow(user: BulkUser, rowIndex: number, options: ValidationOptions): ValidationResult {
  const messages: string[] = [];
  let hasError = false;
  let hasWarning = false;

  const validatedData = {
    ...user,
    distrito_id: null,
    oficina_id: null,
    cargo_administrativo_id: null,
    cargo_operativo_id: null,
  };

  // Helper para marcar error/warning
  const markError = (msg: string) => { messages.push(msg); hasError = true; };
  const markWarning = (msg: string) => { messages.push(msg); if (!hasError) hasWarning = true; };

  // DPI
  if (!user.dpi || !/^\d{13}$/.test(String(user.dpi))) {
    markError('DPI debe tener 13 dígitos numéricos.');
  }

  // Nombre
  if (!user.nombre_completo?.toString().trim()) {
    markError('Nombre completo es requerido.');
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(String(user.email))) {
    markError('Email con formato inválido.');
  }

  // Distrito (CRÍTICO)
  const distritoId = options.findDistrictId(user.distrito || '');
  if (!distritoId) {
    markError(`Distrito "${user.distrito}" no fue encontrado.`);
  } else {
    validatedData.distrito_id = distritoId;
  }

  // Oficina (CRÍTICO)
  const oficinaId = options.findOfficeId(user.oficina || '');
  if (!oficinaId) {
    markError(`Oficina "${user.oficina}" no fue encontrada.`);
  } else {
    validatedData.oficina_id = oficinaId;
  }

  // Cargo Administrativo (CRÍTICO)
  if (user.cargo_administrativo) {
    const cargoAdminId = options.findPositionTypeId(user.cargo_administrativo);
    if (!cargoAdminId) {
      markError(`Cargo Administrativo "${user.cargo_administrativo}" no fue encontrado.`);
    } else {
      validatedData.cargo_administrativo_id = cargoAdminId;
    }
  }

  // Cargo Operativo (NO CRÍTICO -> WARNING)
  if (user.cargo_operativo) {
    const cargoOpId = options.findPositionTypeId(user.cargo_operativo);
    if (!cargoOpId) {
      markWarning(`Cargo Operativo "${user.cargo_operativo}" no fue encontrado.`);
    } else {
      validatedData.cargo_operativo_id = cargoOpId;
    }
  }

  // Teléfono (WARNING)
  if (user.telefono && !/^\d{8,}$/.test(String(user.telefono))) {
    markWarning('Teléfono debe tener al menos 8 dígitos numéricos.');
  }

  // Sueldo Inicial (CRÍTICO)
  if (user.sueldo_inicial !== undefined) {
    const n = Number(user.sueldo_inicial);
    if (isNaN(n) || n <= 0) {
      markError('Sueldo inicial debe ser un número positivo y mayor a 0.');
    }
  }

  // Bonificaciones (WARNING)
  if (user.bonificaciones !== undefined) {
    const b = Number(user.bonificaciones);
    if (isNaN(b) || b < 0) {
      markWarning('Bonificaciones debe ser un número positivo.');
    }
  }

  // Determinar status final
  const status: 'ok' | 'warning' | 'error' = hasError ? 'error' : (hasWarning ? 'warning' : 'ok');

  return {
    row: rowIndex + 1,
    status,
    messages: messages.length ? messages : ['Registro válido'],
    data: validatedData,
  };
}


export function parseCSV(content: string): BulkUser[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const data: BulkUser[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const user: any = {};
    headers.forEach((header, index) => {
      const value = values[index];
      if (header === 'sueldo_inicial' || header === 'bonificaciones') {
        user[header] = value ? parseFloat(value) : undefined;
      } else {
        user[header] = value || undefined;
      }
    });
    data.push(user as BulkUser);
  }
  return data;
}

export async function parseXLSX(file: File): Promise<BulkUser[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);

  return json.map((row: any) => {
    const user: any = {};
    Object.keys(row).forEach(key => {
      const newKey = key.toLowerCase().replace(/\s+/g, '_');
      if (newKey === 'sueldo_inicial' || newKey === 'bonificaciones') {
        user[newKey] = row[key] ? parseFloat(row[key]) : undefined;
      } else {
        user[newKey] = row[key] || undefined;
      }
    });
    return user as BulkUser;
  });
}


export function generateCSVTemplate(): string {
  const headers = ['nombre_completo', 'dpi', 'email', 'distrito', 'oficina', 'cargo_administrativo', 'cargo_operativo', 'telefono', 'sueldo_inicial', 'bonificaciones'];
  const examples = [
    ['María Fernanda Pérez García', '1234567890123', 'maria.perez@example.com', 'DICE', 'AREA NORTE', 'SUPERVISOR', 'SUPERVISOR', '55551234', '4500', '500'],
    ['Juan Carlos López Mendoza', '9876543210987', 'juan.lopez@example.com', 'DINOR', 'OTR PETÉN', 'COORDINADOR', 'COORDINADOR', '55555678', '3200', '300'],
  ];
  const rows = [headers, ...examples];
  return rows.map(row => row.join(',')).join('\n');
}



export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateXLSXTemplate() {
  const headers = ['nombre_completo', 'dpi', 'email', 'distrito', 'oficina', 'cargo_administrativo', 'cargo_operativo', 'telefono', 'sueldo_inicial', 'bonificaciones'];
  const examples = [
    ['María Fernanda Pérez García', '1234567890123', 'maria.perez@example.com', 'DICE', 'AREA NORTE', 'SUPERVISOR', 'SUPERVISOR', '55551234', 4500, 500],
    ['Juan Carlos López Mendoza', '9876543210987', 'juan.lopez@example.com', 'DINOR', 'OTR PETÉN', 'COORDINADOR', 'COORDINADOR', '55555678', 3200, 300],
  ];
  

  const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Empleados');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
}
