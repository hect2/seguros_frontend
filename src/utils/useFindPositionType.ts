import { usePositionTypesList } from "@/seguros/hooks/usePositionTypesList";

export const useFindPositionType = () => {
    const { data: positionTypes } = usePositionTypesList();

    const findPositionTypeIdByName = (name: string) => {
        if (!positionTypes || !name) {
            return null;
        }

        const normalizedName = name.trim().toLowerCase();
        const positionType = positionTypes.data.find(p => p.name.toLowerCase() === normalizedName);

        return positionType ? positionType.id : null;
    };

    return { findPositionTypeIdByName };
};
