export interface IncidentResponse {
    current_page:   number;
    data:           Data[];
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

export interface Data {
    id:            Number;
    date:          Date;
    type:          string;
    description:   string;
    office:        string;
    user_reported: null | string;
    criticity:     string;
    criticity_slug: string;
    status:        string;
    status_slug:        string;
}


export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
