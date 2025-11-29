import { useQuery } from "@tanstack/react-query"
import { getDistrictsAction } from "../../modules/districts/actions/get-districts.action";
import { OfficesListResponse } from "@/interfaces/offices.lists.response";
import { getOfficesListAction } from "../actions/get-list-offices";

export const useOfficesList = () => {

    return useQuery<OfficesListResponse>({
        queryKey: ['offices_list'],
        queryFn: () => getOfficesListAction()
    });
}