export interface GlobalDistributionByRegionResponse {
    totals:    number;
    districts: District[];
}

export interface District {
    code:  string;
    total: number;
    color?: string;
}
