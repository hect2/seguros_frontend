import { api } from "@/api/api";
import { DistributionByRegionResponse } from "../interfaces/distribution-by-region";


export const getDistributionByRegionAction = async (): Promise<DistributionByRegionResponse> => {

  const { data } = await api.get<DistributionByRegionResponse>(`/reports/distribution-by-region`);

  console.log(`DistributionByRegionResponse: `, data)
  return data;
};
