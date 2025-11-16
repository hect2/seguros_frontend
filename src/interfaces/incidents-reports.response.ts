export interface IncidentReports {
    message: string;
    data:    Data;
}

export interface Data {
    period:      Period;
    total:       number;
    in_progress: InProgress;
    resolved:    InProgress;
    critical:    Critical[];
}

export interface Critical {
    critical: string;
    slug:     string;
    total:    number;
}

export interface InProgress {
    status: string;
    total:  number;
}

export interface Period { 
    start_date: Date;
    end_date:   Date;
}
