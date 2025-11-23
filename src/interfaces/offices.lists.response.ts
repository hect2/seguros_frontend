export interface OfficesListResponse {
    error: boolean;
    code:  number;
    data:  Office[];
}

export interface Office {
    id:   number;
    code: string;
}
