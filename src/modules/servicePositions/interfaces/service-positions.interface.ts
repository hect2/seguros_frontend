export interface ServicePosition {
    id:           number;
    business_id:  number;
    name:         string;
    location:     string;
    shift:        string;
    service_type: string;
    active:       boolean;
    district_id:  string;
    office_id:  string;
    created_at:   Date;
    updated_at:   Date;
}
