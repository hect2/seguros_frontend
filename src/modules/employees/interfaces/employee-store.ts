export interface EmployeeStore {
    full_name:             string;
    dpi:                   string;
    birth_date:            Date;
    phone:                 string;
    email:                 string;
    status_id:             number;
    office_id:             number;
    district_id:           number;
    admin_position_id:     number;
    operative_position_id: null;
    salary:                number;
    bonus:                 number;
    description_files:     string;
    files:                 File[];
}

export interface File {
    name:          string;
    file:          string;
    date_emission: Date;
    type:          string;
}
