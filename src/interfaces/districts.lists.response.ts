export interface DistrictsListResponse {
    error: boolean;
    code:  number;
    data:  District[];
}

export interface District {
    id:   number;
    code: string;
}
