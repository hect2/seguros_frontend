export interface RolesListResponse {
    error: boolean;
    code:  number;
    data:  Rol[];
}

export interface Rol {
    id:   number;
    name: string;
}
