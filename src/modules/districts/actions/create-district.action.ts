import { api } from "@/api/api";
import { DistrictStore } from "@/modules/districts/interfaces/district-store";
import { District } from "@/modules/districts/interfaces/district.interface";

export const creatDistrictAction = async (districtLike: Partial<District>) : Promise<DistrictStore> => {
    const {
        id,
        created_at,
        updated_at,
        offices_count,
        ...rest
    } = districtLike

    const { data } = await api<DistrictStore>({
        url: '/districts',
        method: 'POST',
        data: rest,
    });

    return data;
}