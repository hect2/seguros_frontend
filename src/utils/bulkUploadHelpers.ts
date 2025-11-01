export interface BulkUser {
  nombre_completo: string;
  dpi: string;
  email: string;
  rol: string;
  distrito: string;
  oficina: string;
  cargo_administrativo?: string;
  cargo_operativo?: string;
  telefono?: string;
  sueldo_inicial?: number;
  bonificaciones?: number;
  estado?: string;
}
export interface ValidationResult {
  row: number;
  status: 'ok' | 'warning' | 'error';
  messages: string[];
  data: BulkUser;
}
export interface ValidationSummary {
  total: number;
  ok: number;
  warnings: number;
  errors: number;
}
const VALID_ROLES = ['Super Admin', 'Admin', 'Supervisor', 'Operador'];
const VALID_ESTADOS = ['Activo', 'Inactivo', 'Pendiente', 'En revisión'];
const DISTRITO_OFICINAS: Record<string, string[]> = {
  DICE: ['AREA NORTE', 'AREA SUR', 'OTR ESCUINTLA', 'OTR SACATEPÉQUEZ'],
  DINOC: ['OTR COBÁN', 'OTR SALAMÁ', 'OTR QUICHÉ'],
  DINOR: ['OTR PETÉN', 'OTR IZABAL', 'OTR ZACAPA', 'OTR CHIQUIMULA'],
  DISO: ['OTR QUETZALTENANGO', 'OTR HUEHUETENANGO'],
  'DISO SUR': ['OTR RETALHULEU'],
  DIOR: ['OTR JALAPA', 'OTR JUTIAPA'],
  ADMINISTRATIVO: [],
  STAFF: [],
  ACADEMIA: []
};
// Mock database of existing users
const existingDPIs = ['1641754491214', '2343678901234', '3456789012345'];
const existingEmails = ['agalvarez@sigsesa.gt', 'mgarcia@sigsesa.gt', 'cmendez@sigsesa.gt'];
export function validateDPI(dpi: string): {
  valid: boolean;
  message?: string;
} {
  if (!dpi || dpi.length !== 13) {
    return {
      valid: false,
      message: 'DPI debe tener 13 dígitos'
    };
  }
  if (!/^\d{13}$/.test(dpi)) {
    return {
      valid: false,
      message: 'DPI debe contener solo números'
    };
  }
  if (existingDPIs.includes(dpi)) {
    return {
      valid: false,
      message: 'DPI ya existe en el sistema'
    };
  }
  return {
    valid: true
  };
}
export function validateEmail(email: string): {
  valid: boolean;
  message?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      valid: false,
      message: 'Email con formato inválido'
    };
  }
  if (existingEmails.includes(email.toLowerCase())) {
    return {
      valid: false,
      message: 'Email ya existe en el sistema'
    };
  }
  return {
    valid: true
  };
}
export function validateRol(rol: string, importerRole: string): {
  valid: boolean;
  message?: string;
} {
  if (!rol || !VALID_ROLES.includes(rol)) {
    return {
      valid: false,
      message: `Rol inválido. Debe ser uno de: ${VALID_ROLES.join(', ')}`
    };
  }
  if (rol === 'Super Admin' && importerRole !== 'Super Admin') {
    return {
      valid: false,
      message: 'Rol "Super Admin" requiere permisos de importación elevados. Solo Super Admin puede asignar este rol.'
    };
  }
  return {
    valid: true
  };
}
export function validateDistritoOficina(distrito: string, oficina: string): {
  valid: boolean;
  message?: string;
} {
  if (!distrito) {
    return {
      valid: false,
      message: 'Distrito es requerido'
    };
  }
  if (!DISTRITO_OFICINAS[distrito]) {
    return {
      valid: false,
      message: `Distrito "${distrito}" no existe. Verifica en Configuraciones → Asignación Territorial`
    };
  }
  if (!oficina) {
    return {
      valid: false,
      message: 'Oficina es requerida'
    };
  }
  if (DISTRITO_OFICINAS[distrito].length > 0 && !DISTRITO_OFICINAS[distrito].includes(oficina)) {
    return {
      valid: false,
      message: `Oficina "${oficina}" no pertenece al distrito "${distrito}"`
    };
  }
  return {
    valid: true
  };
}
export function validateRow(user: BulkUser, rowIndex: number, importerRole: string = 'Admin'): ValidationResult {
  const messages: string[] = [];
  let status: 'ok' | 'warning' | 'error' = 'ok';
  // Required fields
  if (!user.nombre_completo?.trim()) {
    messages.push('Nombre completo es requerido');
    status = 'error';
  }
  const dpiValidation = validateDPI(user.dpi);
  if (!dpiValidation.valid) {
    messages.push(dpiValidation.message!);
    status = 'error';
  }
  const emailValidation = validateEmail(user.email);
  if (!emailValidation.valid) {
    messages.push(emailValidation.message!);
    status = 'error';
  }
  const rolValidation = validateRol(user.rol, importerRole);
  if (!rolValidation.valid) {
    messages.push(rolValidation.message!);
    status = 'error';
  }
  const distritoOficinaValidation = validateDistritoOficina(user.distrito, user.oficina);
  if (!distritoOficinaValidation.valid) {
    messages.push(distritoOficinaValidation.message!);
    status = 'error';
  }
  // Optional field validations
  if (user.sueldo_inicial !== undefined && user.sueldo_inicial < 0) {
    messages.push('Sueldo inicial debe ser mayor o igual a 0');
    status = status === 'error' ? 'error' : 'warning';
  }
  if (user.bonificaciones !== undefined && user.bonificaciones < 0) {
    messages.push('Bonificaciones deben ser mayor o igual a 0');
    status = status === 'error' ? 'error' : 'warning';
  }
  if (user.estado && !VALID_ESTADOS.includes(user.estado)) {
    messages.push(`Estado inválido. Debe ser uno de: ${VALID_ESTADOS.join(', ')}`);
    status = status === 'error' ? 'error' : 'warning';
  }
  return {
    row: rowIndex + 1,
    status,
    messages: messages.length > 0 ? messages : ['Registro válido'],
    data: user
  };
}
export function generateCSVTemplate(): string {
  const headers = ['nombre_completo', 'dpi', 'email', 'rol', 'distrito', 'oficina', 'cargo_administrativo', 'cargo_operativo', 'telefono', 'sueldo_inicial', 'bonificaciones', 'estado'];
  const examples = [['María Fernanda Pérez García', '1234567890123', 'maria.perez@sigsesa.gt', 'Supervisor', 'DICE', 'AREA NORTE', 'SUPERVISOR', 'SUPERVISOR', '55551234', '4500', '500', 'Activo'], ['Juan Carlos López Mendoza', '9876543210987', 'juan.lopez@sigsesa.gt', 'Operador', 'DINOR', 'OTR PETÉN', 'COORDINADOR', 'COORDINADOR', '55555678', '3200', '300', 'Activo'], ['Ana Lucía Rodríguez Santos', '5555555555555', 'ana.rodriguez@sigsesa.gt', 'Admin', 'DINOC', 'OTR COBÁN', 'JEFE DE ÁREA', 'JEFE DE ÁREA', '55559012', '3800', '400', 'Activo']];
  const rows = [headers, ...examples];
  return rows.map(row => row.join(',')).join('\n');
}
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\ufeff' + content], {
    type: 'text/csv;charset=utf-8;'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
export function parseCSV(content: string): BulkUser[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
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
export function generateErrorCSV(results: ValidationResult[]): string {
  const errorRows = results.filter(r => r.status === 'error');
  if (errorRows.length === 0) return '';
  const headers = ['fila', 'nombre_completo', 'dpi', 'email', 'rol', 'distrito', 'oficina', 'errores'];
  const rows = errorRows.map(r => [r.row.toString(), r.data.nombre_completo, r.data.dpi, r.data.email, r.data.rol, r.data.distrito, r.data.oficina, r.messages.join('; ')]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}