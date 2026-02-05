export interface IncidentCatalogListResponse {
    error: boolean;
    code:  number;
    data:  IncidentCatalogList[];
}

export interface IncidentCatalogList {
    id:   number;
    name: string;
    slug: string;
}
