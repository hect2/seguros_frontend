export interface IncidentTypeCatalog {
    id: number;
    name: string;
    slug: string;
}

export interface IncidentTypeCatalogListResponse {
    error: boolean;
    code: number;
    data: IncidentTypeCatalog[];
}
