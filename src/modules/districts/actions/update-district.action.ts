import { api } from "@/api/api";
import { District } from "@/modules/districts/interfaces/district.interface";

export const updateDistrictAction = async (districtData: Partial<District>) => {
  if (!districtData.id) {
    throw new Error("District ID is required for updating.");
  }
  const { id, ...dataToUpdate } = districtData;

  const { data } = await api<District>({
          url: `/districts/${id}`,
          method: 'PUT',
          data: dataToUpdate,
      });
  return data;
};
