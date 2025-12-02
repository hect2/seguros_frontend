export interface Office {
  id: number;
  name: string;
  description: string;
  code: string;
  status: number;
  district: {
    id: number;
    name: string;
    code: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
