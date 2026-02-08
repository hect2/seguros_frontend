export interface ServicePositionListResponse {
    error: boolean;
    code:  number;
    data:  ServicePositionList[];
}

export interface ServicePositionList {
    id:       number;
    name:     string;
    location: string;
    business_id: number;
    business:    Business;
}

export interface Business {
    id:   number;
    name: string;
}
