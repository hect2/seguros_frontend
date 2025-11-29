export interface StatusEmployeesListResponse {
    error: boolean;
    code:  number;
    data:  StatusEmployee[];
}

export interface StatusEmployee {
    id:   number;
    name: string;
    slug: string;
}
