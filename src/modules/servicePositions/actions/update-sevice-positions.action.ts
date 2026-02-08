import { api } from "@/api/api";

export interface ServicePositionStore {
  id: number;
  business_id: number;
  name: string;
  location: string;
  shift: string;
  service_type: string;
  active: boolean;
}

export const updateServicePositionAction = async (servicePositionLike: Partial<ServicePositionStore>) => {
  if (!servicePositionLike.id) {
    throw new Error("Service Position ID is required for updating.");
  }
  const { id, ...dataToUpdate } = servicePositionLike;
  const { data } = await api<ServicePositionStore>({
    url: `/service-positions/${id}`,
    method: 'PUT',
    data: dataToUpdate,
  });
  return data;
};
