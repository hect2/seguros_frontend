export interface HiresLowsSummaryResponse {
    offices: HiresLowsOffice[];
    totals:  HiresLowsTotals;
    date_range: DateRange;
}

export interface HiresLowsOffice {
    id:          number;
    name:        string;
    hires_count: number;
    lows_count:  number;
}

export interface HiresLowsTotals {
    total_hires: number;
    total_lows:  number;
}

export interface DateRange {
    start_date: string;
    end_date:   string;
}
