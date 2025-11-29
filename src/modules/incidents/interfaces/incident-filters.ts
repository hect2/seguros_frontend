export interface IncidentFilters {
  criticality?: string[] | number[];
  dateFrom?: string;
  dateTo?: string;
  office?: string | number;
  type?: string | number;
  user?: string;
}