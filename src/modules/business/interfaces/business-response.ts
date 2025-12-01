export interface BusinessResponse {
    error: boolean;
    code:  number;
    data:  Business;
}

export interface Business {
    id:         number;
    name:       string;
    direction:  string;
    phone:      string;
    status:     number;
    created_at: Date;
    updated_at: Date;
}
