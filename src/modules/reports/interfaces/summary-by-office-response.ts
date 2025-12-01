export interface SummaryByOfficeResponse {
    offices: SummaryByOffice[];
    totals:  SummaryByOfficeTotals;
}

export interface SummaryByOffice {
    id:                     number;
    district_id:            number;
    user_id:                number;
    code:                   string;
    name:                   string;
    direction:              string;
    phone:                  string;
    observations:           string;
    status:                 number;
    created_at:             Date;
    updated_at:             Date;
    temporary_guards_count: number;
    suspended_count:        number;
    training_count:         number;
    total_insured_count:    number;
}

export interface SummaryByOfficeTotals {
    total_temporary_guards: number;
    total_suspended:        number;
    total_training:         number;
    total_insured:          number;
}
