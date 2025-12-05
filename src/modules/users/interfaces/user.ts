export interface User {
    id:           number;
    name:         string;
    email:        string;
    password:     string;
    status:       number;
    dpi:          string;
    phone:        string;
    district:     number[];
    observations: string;
    role_id:      number;
}
