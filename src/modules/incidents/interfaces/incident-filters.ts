export interface IncidentFilters {
  criticality?: string[] | number[];
  dateFrom?: string;
  dateTo?: string;
  district?: string | number;
  type?: string | number;
  user?: string;
}