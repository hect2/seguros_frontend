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
