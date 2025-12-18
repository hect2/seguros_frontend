import { StatusEmployee } from "./status-employee.interface";

export interface StatusEmployeesResponse {
    current_page: number;
    data:         StatusEmployee[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          any[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}
