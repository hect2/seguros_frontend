export interface AuthResponse {
    token: string;
    user:  User;
}

export interface User {
    id:               number;
    name:             string;
    email:            string;
    dpi:              string;
    phone:            string;
    district:         string[];
    office:           string[];
    role_names:       string[];
    permission_names: string[];
}
