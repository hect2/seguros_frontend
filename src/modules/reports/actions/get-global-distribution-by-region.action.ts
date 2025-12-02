import { api } from "@/api/api";
import { GlobalDistributionByRegionResponse } from "../interfaces/global-distribution-by-region";


export const getGlobalDistributionByRegionAction = async (): Promise<GlobalDistributionByRegionResponse> => {

  const { data } = await api.get<GlobalDistributionByRegionResponse>(`/reports/global-distribution-by-region`);

  console.log(`GlobalDistributionByRegionResponse: `, data)
  return data;
};
