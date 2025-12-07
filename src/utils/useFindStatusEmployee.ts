import { useStatusEmployeesList } from "@/seguros/hooks/useStatusEmployeesList";

export function useFindStatusEmployee() {
  const { data, isLoading } = useStatusEmployeesList();

  const findstatus = (id: number) => {
    if (!data) return { name: `Status Employee ${id}` }; // todavía cargando o lista vacía

    const stratus = data.data.find((item) => item.id === id);

    return stratus || { name: `Status Employee ${id}` };
  };

  return { findstatus, isLoading };
}

export const useFindStatusEmployeeByName = () => {
    const { data: statusEmployees } = useStatusEmployeesList();

    const findStatusEmployeeIdByName = (name: string) => {
        if (!statusEmployees || !name) {
            return null;
        }

        const normalizedName = name.trim().toLowerCase();
        const statusEmployee = statusEmployees.data.find(s => s.name.toLowerCase() === normalizedName);

        return statusEmployee ? statusEmployee.id : null;
    };

    return { findStatusEmployeeIdByName };
};

export const useFindStatusEmployeeSlugById = () => {
    const { data: statusEmployees } = useStatusEmployeesList();

    const findStatusEmployeeSlugByName = (id: number) => {
        if (!statusEmployees || !id) {
            return null;
        }

        const statusEmployee = statusEmployees.data.find(s => s.id === id);
        console.log(`useFindStatusEmployeeSlugById: `, statusEmployee)

        return statusEmployee ? statusEmployee.slug : null;
    };

    return { findStatusEmployeeSlugByName };
};