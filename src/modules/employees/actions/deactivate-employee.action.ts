import { api } from "../../../api/api";

export const deactivateEmployee = (userId: number) => {
  return api({
    url: `/employees/deactivate/${userId}`,
    method: "POST",
    data: {
      inactive_user: true,
    },
  });
};
