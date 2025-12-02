export interface DistributionByRegionResponse {
    districts: District[];
}

export interface District {
    code:    string;
    total:   number;
    offices: Office[];
}

export interface Office {
    code:  string;
    total: number;
}
