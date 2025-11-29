import { api } from '@/api/api';
import { StatusEmployeesListResponse } from '@/interfaces/status_employees.lists.response';

export const getStatusEmployeesListAction = async (): Promise<StatusEmployeesListResponse> => {

    const { data } = await api.get<StatusEmployeesListResponse>(`/list/status-employees`);

    console.log('Status employees List data:', data);

    return data;
}