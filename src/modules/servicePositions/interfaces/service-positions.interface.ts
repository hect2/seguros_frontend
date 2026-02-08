export interface ServicePosition {
    id:           number;
    business_id:  number;
    name:         string;
    location:     string;
    shift:        string;
    service_type: string;
    active:       boolean;
    created_at:   Date;
    updated_at:   Date;
}
