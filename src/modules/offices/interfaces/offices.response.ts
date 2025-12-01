import { Office } from "./office.interface";

export interface OfficesResponse {
  offices: Office[];
  total: number;
  page: number;
  limit: number;
}
