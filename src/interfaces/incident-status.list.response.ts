export interface IncidentStatusListResponse {
    error: boolean;
    code:  number;
    data:  IncidentStatusList[];
}

export interface IncidentStatusList {
    id:   number;
    name: string;
    slug: string;
}
