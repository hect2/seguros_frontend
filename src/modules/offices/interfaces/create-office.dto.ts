export interface CreateOfficeDto {
    name: string;
    description?: string;
    code: string;
    status: number;
    district_id: number;
}
