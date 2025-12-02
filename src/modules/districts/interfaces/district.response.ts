export interface DistrictResponse {
    error: boolean;
    code:  number;
    data:  District;
}

export interface District {
    id:          number;
    code:        string;
    name:        string;
    description: string;
    status:      number;
    created_at:  Date;
    updated_at:  Date;
    business_id: number | null;
    offices:     Office[];
}

export interface Office {
    id:           number;
    district_id:  number;
    user_id:      number;
    code:         string;
    name:         string;
    direction:    string;
    phone:        string;
    observations: string;
    status:       number;
    created_at:   Date;
    updated_at:   Date;
}
