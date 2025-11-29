import { useQuery } from "@tanstack/react-query";
import { getBusinessesTotal } from "../modules/business/actions/get-businesses-total.action";
import { getDistrictsTotal } from "../modules/districts/actions/get-districts-total.action";
import { getOfficesTotal } from "../modules/offices/actions/get-offices-total.action";

export const useTerritorialCounters = () => {
  const { data: businessesTotal, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["businesses-total"],
    queryFn: getBusinessesTotal,
  });

  const { data: districtsTotal, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts-total"],
    queryFn: getDistrictsTotal,
  });

  const { data: officesTotal, isLoading: isLoadingOffices } = useQuery({
    queryKey: ["offices-total"],
    queryFn: getOfficesTotal,
  });

  return {
    businessesTotal: businessesTotal ?? 0,
    districtsTotal: districtsTotal ?? 0,
    officesTotal: officesTotal ?? 0,
    isLoading: isLoadingBusinesses || isLoadingDistricts || isLoadingOffices,
  };
};
