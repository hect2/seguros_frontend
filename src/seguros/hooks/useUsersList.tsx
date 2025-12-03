import { useQuery } from "@tanstack/react-query";
import { getListUsers } from "../actions/get-list-users";

export const useUsersList = () => {
  const query = useQuery({
    queryKey: ["usersList"],
    queryFn: getListUsers,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
