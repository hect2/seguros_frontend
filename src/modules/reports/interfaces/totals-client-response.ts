export interface TotalsClientResponse {
    top_client_name: string;
    offices:         ClientInfo[];
    totals:          Totals;
}

export interface ClientInfo {
    office_id:        number;
    office_code:      string;
    top_client_count: number;
    others_count:     number;
    available_count:  number;
    reserve_count:    number;
    total:            number;
}

export interface Totals {
    total_top_client: number;
    total_others:     number;
    total_available:  number;
    total_reserve:    number;
    grand_total:      number;
}
