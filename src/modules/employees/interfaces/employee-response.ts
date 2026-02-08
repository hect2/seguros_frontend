export interface EmployeeResponse {
    error: boolean;
    code:  number;
    data:  Employee;
}

export interface Employee {
    id:                        number;
    full_name:                 string;
    dpi:                       string;
    birth_date:                Date;
    phone:                     string;
    email:                     string;
    files:                     Files;
    digessp_code:              string | null;
    digessp_fecha_vencimiento: string | null;
    status_id:                 number;
    created_at:                Date;
    updated_at:                Date;
    positions:                 Position[];
    trackings:                 Tracking[];
    status:                    Status;
}

export interface Files {
    files:             File[];
    description_files: null;
}

export interface File {
    url:           string;
    path:          string;
    type:          string;
    uuid:          string;
    filename:      string;
    mime_type:     string;
    size_bytes:    number;
    status:        number;
    uploaded_at:   Date;
    date_emission: Date;
}

export interface Position {
    id:                         number;
    employee_id:                number;
    office_id:                  number;
    district_id:                number;
    admin_position_type_id:     number;
    operative_position_type_id: null | number;
    initial_salary:             string;
    bonuses:                    string;
    status:                     number;
    created_at:                 Date;
    updated_at:                 Date;
    admin_position_type:        PositionType;
    operative_position_type:    PositionType | null;
    office:                     Office;
    district:                   District;
    client:                   Client;

    employee_code:              null | string;
    admission_date:             null | string;
    departure_date:             null | string;
    client_id:                  null | string;
    service_position_id:                  null | string;
    position_id:                null | string;
    employee_status_id:         null | string;
    turn:                       null | string;
    reason_for_leaving:         null | string;
    suspension_date:            null | string;
    life_insurance_code:        null | string;
}

export interface Status {
    id:          number;
    name:        string;
    slug:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Tracking {
    id:            number;
    employee_id:   number;
    name:          string;
    responsible:   null | string;
    approval_date: Date | null;
    status:        number;
    description:   string;
    created_at:    Date;
    updated_at:    Date;
}

export interface PositionType {
    id:          number;
    name:        string;
}

export interface Office {
    id:          number;
    code:        string;
}

export interface District {
    id:          number;
    code:        string;
}

export interface Client {
    id:          number;
    name:        string;
}
