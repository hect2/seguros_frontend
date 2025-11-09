import { District } from "./district.interface";

export interface DistrictsResponse {
    current_page:   number;
    data:           District[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}