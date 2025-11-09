import { useSearchParams } from 'react-router-dom';

interface Props {
    totalPages: number;
    from: number;
    to: number;
    totalItems: number;
}

export const CustomPagination = ({ totalPages, from, to, totalItems }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryPage = searchParams.get('page') || '1';
    const page = isNaN(+queryPage) ? 1 : +queryPage;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        searchParams.set('page', page.toString());

        setSearchParams(searchParams);
    };

    return (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
                Mostrando {from} a {to} de {totalItems} distritos
            </div>
            <div className="flex items-center space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    Anterior
                </button>
                <button className="px-3 py-1.5 bg-[#cf2e2e] text-white rounded-lg text-sm">
                    Página {page} de {totalPages}
                </button>
                <button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};