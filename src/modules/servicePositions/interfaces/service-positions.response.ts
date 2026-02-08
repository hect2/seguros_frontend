export interface ServicePositionResponses {
    current_page:   number;
    data:           ServicePosition[];
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

export interface ServicePosition {
    id:             number;
    business_id:    number;
    name:           string;
    location:       string;
    shift:          string;
    service_type:   string;
    active:         number;
    created_at:     Date;
    updated_at:     Date;
    business_name:  string;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
