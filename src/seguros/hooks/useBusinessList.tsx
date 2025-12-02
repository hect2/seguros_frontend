import { useQuery } from "@tanstack/react-query";
import { getListBusiness } from "../actions/get-list-business";

export const useBusinessList = () => {
  const query = useQuery({
    queryKey: ["businessList"],
    queryFn: getListBusiness,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
