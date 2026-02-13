import { api } from "@/api/api";

export type ReportType = "digessp_certifications" | "summary_by_office" | "totals_by_client" | "day_summary" | "week_summary" | "fifteen_summary" | "all_summary";

export interface ReportFilters {
  report_type?: string;
  format?: string;
  office_id?: number;
  start_date?: string;
  end_date?: string;
}

export const getReportAction = async (reportType: ReportType, filters: ReportFilters): Promise<any> => {
  const {
    ...rest
  } = filters

  rest.report_type = reportType;

  const { data } = await api<any>({
    url: '/reports',
    method: 'POST',
    data: rest,
  });

  console.log(`Report ${reportType} : ${data}`);

  return data;
};
