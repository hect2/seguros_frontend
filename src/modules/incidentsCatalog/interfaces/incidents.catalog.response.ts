export interface IncidentsCatalogResponse {
    current_page:   number;
    data:           IncidentCatalog[];
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

export interface IncidentCatalog {
    id:         number;
    name:       string;
    slug:       string;
    type:       Type;
    group:      Group;
    active:     number;
    created_at: Date;
    updated_at: Date;
}

export enum Group {
    Disciplinario = "disciplinario",
    Laboral = "laboral",
    Legal = "legal",
}

export enum Type {
    Alta = "ALTA",
    Baja = "BAJA",
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
