import { useUsersList } from "@/seguros/hooks/useUsersList";


export function useFindUser() {
  const { data, isLoading } = useUsersList();

  const findUser = (id: number) => {
    if (!data) return { name: `Usuario ${id}` }; // todavía cargando o lista vacía

    const user = data.data.find((item) => item.id === id);

    return user || { name: `Usuario ${id}` };
  };

  return { findUser, isLoading };
}
