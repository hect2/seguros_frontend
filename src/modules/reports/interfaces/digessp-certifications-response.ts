export interface DigesspResponse {
    offices: Digessp[];
    totals:  DigesspTotals;
}

export interface Digessp {
    code:            string;
    total:           number;
    vigentes:        number;
    percentage:      number;
    vencidos:        number;
    sin_certificado: number;
}

export interface DigesspTotals {
    total:                 number;
    total_vigentes:        number;
    total_vencidos:        number;
    total_sin_certificado: number;
}
