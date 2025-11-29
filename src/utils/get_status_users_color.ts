const colors = {
    active: 'bg-green-100 text-green-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-orange-100 text-orange-700',
    inactive: 'bg-gray-100 text-gray-700'
};

export const getStatusUserColor = (status: string) =>
    colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';