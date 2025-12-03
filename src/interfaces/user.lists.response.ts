export interface UserListResponse {
    error: boolean;
    code:  number;
    data:  UserList[];
}

export interface UserList {
    id:   number;
    name: string;
}
