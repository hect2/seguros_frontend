export const styles = {
    in_progress: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    pending: 'bg-gray-100 text-gray-700'
};

export const getStatusColor = (estado: string) =>
    styles[estado as keyof typeof styles] || '';
