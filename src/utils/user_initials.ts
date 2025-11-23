export const getInitials = (nombre: string) => {
    const words = nombre.split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
};