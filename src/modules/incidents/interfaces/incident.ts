export interface Incident {
    title:         string;
    description:   string;
    type_id:       number;
    office_id:     number;
    criticity_id:  number;
    user_reported: number;
    user_assigned: number | null;
    status:        number;
    files:         File[];
    criticity_slug: string;
}

export interface File {
    name: string;
    file: string;
}