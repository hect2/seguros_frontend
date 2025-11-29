const colors = {
    'Super Administrador': 'bg-purple-100 text-purple-700',
    Administrador: 'bg-blue-100 text-blue-700',
    Supervidor: 'bg-green-100 text-green-700',
    Operador: 'bg-gray-100 text-gray-700'
};

export const getRolesUserColor = (rol: string) =>
    colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-700';