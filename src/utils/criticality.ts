export const colors = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-orange-100 text-orange-700 border-orange-300',
    low: 'bg-green-100 text-green-700 border-green-300'
};

export const getCriticalityColor = (criticidad: string) =>
    colors[criticidad as keyof typeof colors] || '';
