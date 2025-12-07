import { useDistrictsList } from "@/seguros/hooks/useDistrictsList";

export const useFindDistrict = () => {
    const { data: districts } = useDistrictsList();

    const findDistrictIdByName = (name: string) => {
        if (!districts || !name) {
            return null;
        }

        const normalizedName = name.trim().toLowerCase();
        const district = districts.data.find(d => d.code.toLowerCase() === normalizedName);

        return district ? district.id : null;
    };

    return { findDistrictIdByName };
};
