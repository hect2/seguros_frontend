export interface BusinessListResponse {
    error: boolean;
    code:  number;
    data:  Business[];
}

export interface Business {
    id:   number;
    name: string;
}
