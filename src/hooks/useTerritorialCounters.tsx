import { useQuery } from "@tanstack/react-query";
import { getBusinessesTotal } from "../modules/business/actions/get-businesses-total.action";
import { getDistrictsTotal } from "../modules/districts/actions/get-districts-total.action";
import { getOfficesTotal } from "../modules/offices/actions/get-offices-total.action";
import { getPositionsTypesTotal } from "@/modules/business/actions/get-positions-types-total.action";
import { getStatusemployeeTotal } from "@/modules/business/actions/get-status-employee-total.action";
import { getIncidentsCatalogTotal } from "@/modules/incidentsCatalog/actions/get-incidents-total.action";
import { getServicePositionTotal } from "@/modules/servicePositions/actions/get-service-positions-total.action";

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

  const { data: positionsTypesTotal, isLoading: isLoadingPositionsTypes } = useQuery({
    queryKey: ["positions-types-total"],
    queryFn: getPositionsTypesTotal,
  });

  const { data: statusEmployeeTotal, isLoading: isLoadingStatusEmployee } = useQuery({
    queryKey: ["status-employee-total"],
    queryFn: getStatusemployeeTotal,
  });

  const { data: incidentsCatalogTotal, isLoading: isLoadingIncidentsCatalog } = useQuery({
    queryKey: ["incidents-catalog-total"],
    queryFn: getIncidentsCatalogTotal,
  });

  const { data: servicePositionTotal, isLoading: isLoadingServicePosition } = useQuery({
    queryKey: ["service-position-total"],
    queryFn: getServicePositionTotal,
  });

  return {
    businessesTotal: businessesTotal ?? 0,
    districtsTotal: districtsTotal ?? 0,
    officesTotal: officesTotal ?? 0,
    positionsTypesTotal: positionsTypesTotal ?? 0,
    statusEmployeeTotal: statusEmployeeTotal ?? 0,
    incidentsCatalogTotal: incidentsCatalogTotal ?? 0,
    servicePositionTotal: servicePositionTotal ?? 0,
    isLoading: isLoadingBusinesses || isLoadingDistricts || isLoadingOffices || isLoadingPositionsTypes || isLoadingStatusEmployee || isLoadingIncidentsCatalog || isLoadingServicePosition,
  };
};
