export interface CriticalsListResponse {
    error: boolean;
    code:  number;
    data:  Critical[];
}

export interface Critical {
    id:   number;
    name: string;
    slug: string;
}
