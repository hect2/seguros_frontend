export interface Distrito {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  estado: 'Activo' | 'Inactivo';
  oficinasCount: number;
  updatedAt: string;
}
export interface Oficina {
  id: string;
  nombre: string;
  codigo: string;
  distrito: string;
  direccion?: string;
  telefono?: string;
  usuarioAsignado?: string;
  estado: 'Activo' | 'Inactivo';
  observaciones?: string;
  updatedAt: string;
}
export interface Usuario {
  id: string;
  nombre: string;
  codigo: string;
  cargo: string;
}
export const mockUsuarios: Usuario[] = [{
  id: '1',
  nombre: 'Alangumer Gonzalo Eduardo Ángel López',
  codigo: '97326',
  cargo: 'Supervisor'
}, {
  id: '2',
  nombre: 'María Fernanda García Rodríguez',
  codigo: '85432',
  cargo: 'Jefe de Área'
}, {
  id: '3',
  nombre: 'Carlos Alberto Méndez Torres',
  codigo: '76543',
  cargo: 'Supervisor'
}, {
  id: '4',
  nombre: 'Ana Lucía Morales Vásquez',
  codigo: '92145',
  cargo: 'Coordinador'
}, {
  id: '5',
  nombre: 'Roberto José Castillo Hernández',
  codigo: '68234',
  cargo: 'Jefe de Área'
}];
export const mockDistritos: Distrito[] = [{
  id: 'DINOC',
  nombre: 'DINOC',
  codigo: 'DINOC',
  descripcion: 'Distrito Norte Central',
  estado: 'Activo',
  oficinasCount: 3,
  updatedAt: '2025-10-20 10:15'
}, {
  id: 'DICE',
  nombre: 'DICE',
  codigo: 'DICE',
  descripcion: 'Distrito Central',
  estado: 'Activo',
  oficinasCount: 4,
  updatedAt: '2025-10-19 09:02'
}, {
  id: 'DINOR',
  nombre: 'DINOR',
  codigo: 'DINOR',
  descripcion: 'Distrito Noreste',
  estado: 'Activo',
  oficinasCount: 4,
  updatedAt: '2025-10-18 14:30'
}, {
  id: 'DISO',
  nombre: 'DISO',
  codigo: 'DISO',
  descripcion: 'Distrito Suroccidente',
  estado: 'Activo',
  oficinasCount: 3,
  updatedAt: '2025-10-17 11:20'
}, {
  id: 'DISO_SUR',
  nombre: 'DISO SUR',
  codigo: 'DISO_SUR',
  descripcion: 'Distrito Sur',
  estado: 'Inactivo',
  oficinasCount: 2,
  updatedAt: '2025-10-18 16:40'
}, {
  id: 'DIOR',
  nombre: 'DIOR',
  codigo: 'DIOR',
  descripcion: 'Distrito Oriente',
  estado: 'Activo',
  oficinasCount: 3,
  updatedAt: '2025-10-16 09:45'
}];
export const mockOficinas: Oficina[] = [{
  id: 'AR-NORTE',
  nombre: 'AREA NORTE',
  codigo: 'AR-NORTE',
  distrito: 'DICE',
  direccion: 'Zona 1, Ciudad de Guatemala',
  telefono: '+502 2222-1111',
  usuarioAsignado: 'Alangumer Gonzalo Eduardo Ángel López (Supervisor)',
  estado: 'Activo',
  updatedAt: '2025-10-20'
}, {
  id: 'AR-SUR',
  nombre: 'AREA SUR',
  codigo: 'AR-SUR',
  distrito: 'DICE',
  estado: 'Activo',
  updatedAt: '2025-10-19'
}, {
  id: 'ESCUINTLA',
  nombre: 'OTR ESCUINTLA',
  codigo: 'ESCUINTLA',
  distrito: 'DICE',
  estado: 'Activo',
  updatedAt: '2025-10-18'
}, {
  id: 'SACATEPEQUEZ',
  nombre: 'OTR SACATEPÉQUEZ',
  codigo: 'SACATEPEQUEZ',
  distrito: 'DICE',
  estado: 'Activo',
  updatedAt: '2025-10-17'
}, {
  id: 'COBAN',
  nombre: 'OTR COBÁN',
  codigo: 'COBAN',
  distrito: 'DINOC',
  direccion: 'Alta Verapaz',
  usuarioAsignado: 'Carlos Alberto Méndez Torres',
  estado: 'Activo',
  updatedAt: '2025-10-20'
}, {
  id: 'SALAMA',
  nombre: 'OTR SALAMÁ',
  codigo: 'SALAMA',
  distrito: 'DINOC',
  estado: 'Activo',
  updatedAt: '2025-10-19'
}, {
  id: 'QUICHE',
  nombre: 'OTR QUICHÉ',
  codigo: 'QUICHE',
  distrito: 'DINOC',
  estado: 'Activo',
  updatedAt: '2025-10-18'
}, {
  id: 'PETEN',
  nombre: 'OTR PETÉN',
  codigo: 'PETEN',
  distrito: 'DINOR',
  estado: 'Activo',
  updatedAt: '2025-10-20'
}, {
  id: 'IZABAL',
  nombre: 'OTR IZABAL',
  codigo: 'IZABAL',
  distrito: 'DINOR',
  estado: 'Activo',
  updatedAt: '2025-10-19'
}, {
  id: 'ZACAPA',
  nombre: 'OTR ZACAPA',
  codigo: 'ZACAPA',
  distrito: 'DINOR',
  estado: 'Activo',
  updatedAt: '2025-10-18'
}, {
  id: 'CHIQUIMULA',
  nombre: 'OTR CHIQUIMULA',
  codigo: 'CHIQUIMULA',
  distrito: 'DINOR',
  estado: 'Activo',
  updatedAt: '2025-10-17'
}, {
  id: 'RETALHULEU',
  nombre: 'OTR RETALHULEU',
  codigo: 'RETALHULEU',
  distrito: 'DISO_SUR',
  estado: 'Inactivo',
  updatedAt: '2025-10-16'
}];