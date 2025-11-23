export interface TypesListResponse {
    error: boolean;
    code:  number;
    data:  Type[];
}

export interface Type {
    id:   number;
    name: string;
}
