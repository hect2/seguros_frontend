export interface CreateEmployeeDto {
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  roleId: number;
  businessId?: number;
  districtId?: number;
  officeId?: number;
  digessp_fecha_vencimiento?: string;
}
