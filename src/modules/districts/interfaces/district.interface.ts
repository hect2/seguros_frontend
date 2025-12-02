export interface District {
    id:          number;
    code:        string;
    name:        string;
    description: string;
    status:      number;
    offices_count: number;
    business_id: number;
    mode:        string;
    created_at:  Date;
    updated_at:  Date;
}