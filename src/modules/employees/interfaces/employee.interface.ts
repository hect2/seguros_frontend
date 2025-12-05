export interface Employee {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  roles: { id: number; name: string }[];
  business: { id: number; name: string } | null;
  district: { id: number; name: string } | null;
  office: { id: number; name: string } | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
