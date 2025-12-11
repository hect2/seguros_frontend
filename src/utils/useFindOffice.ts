import { useOfficesList } from "@/seguros/hooks/useOfficesList";

export const useFindOffice = () => {
    const { data: offices } = useOfficesList({
        district_id: 0,
        user_id: 0,
    });

    const findOfficeIdByName = (name: string) => {
        if (!offices || !name) {
            return null;
        }

        const normalizedName = name.trim().toLowerCase();
        const office = offices.data.find(o => o.code.toLowerCase() === normalizedName);

        return office ? office.id : null;
    };

    return { findOfficeIdByName };
};
