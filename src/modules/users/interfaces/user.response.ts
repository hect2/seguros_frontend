export interface UserResponse {
    error: boolean;
    code:  number;
    data:  User;
}

export interface User {
    id:           number;
    name:         string;
    email:        string;
    phone:        string;
    status_id:    number;
    status_slug:  string;
    status_name:  string;
    dpi:          string;
    role_id:      number;
    role_name:    string;
    district:     string[];
    districtIds:  number[];
    office:       string[];
    officeIds:    number[];
    last_login:   Date | null;
    last_changed_password:   Date | null;
    created_at:   Date | null;
    updated_at:   Date | null;
    observations: string;
    role_names:   string[];
}
