export interface Incident {
    title:         string;
    description:   string;
    type_id:       number;
    district_id:     number;
    criticity_id:  number;
    user_reported: number;
    user_assigned: number | null;
    status:        number;
    files:         File[];
    criticity_slug: string;
    follow_date:    Date;
}

export interface File {
    name: string;
    file: string;
}