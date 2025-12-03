import { api } from "@/api/api";
import { UserListResponse } from "@/interfaces/user.lists.response";
import { User } from "@/modules/users/interfaces/user";

export const getListUsers = async (): Promise<UserListResponse> => {
  // Assuming the endpoint '/users/list' returns a simple array of users
  // Adjust the endpoint if necessary
  const { data } = await api.get<UserListResponse>("list/users");
  return data;
};
