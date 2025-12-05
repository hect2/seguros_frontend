export interface PositionTypesListResponse {
    error: boolean;
    code:  number;
    data:  Datum[];
}

export interface Datum {
    id:   number;
    name: string;
}
