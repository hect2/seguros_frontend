export interface UsersResponse {
    current_page:   number;
    data:           Data[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Data {
    id:               number;
    name:             string;
    email:            string;
    status_slug:      string;
    status_name:      string;
    dpi:              string;
    role_name:        string;
    district:         string[];
    office:           string[];
    last_login:       string;
    role_names:       any[];
    permission_names: any[];
    roles:            any[];
    permissions:      any[];
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
