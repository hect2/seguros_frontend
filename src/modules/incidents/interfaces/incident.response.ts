export interface IncidentResponse {
    error: boolean;
    code:  number;
    data:  Incident;
}

export interface Incident {
    id:             number;
    title:          string;
    type:           string;
    office:         string;
    criticity:      string;
    criticity_slug: string;
    description:    string;
    files:          File[];
    status:         string;
    status_slug:    string;
    user_reported:  string;
    user_assigned:  string;
    created_at:     Date;
}

export interface File {
    uuid:           string;
    filename:        string;
    path:        string;
    url:            string
    mime_type:   string;
    size_bytes:     number;
    uploaded_at: string;
}