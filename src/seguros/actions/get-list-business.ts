import { api } from "@/api/api";
import { BusinessListResponse } from "@/interfaces/business.lists.response";

export const getListBusiness = async (): Promise<BusinessListResponse> => {
  const { data } = await api.get<BusinessListResponse>("/list/business");
  return data;
};
