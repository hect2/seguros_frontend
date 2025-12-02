import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useOffice } from '../hooks/useOffice';
import { ArrowLeft, Edit } from 'lucide-react';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';

function DetailItem({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
    );
}

export function OfficeDetailView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const officeId = id ? parseInt(id, 10) : null;
    const { data: office, isLoading, isError } = useOffice(officeId);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (isError || !office) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Error: No se pudo cargar la información de la oficina.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex justify-between items-center">
                            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                                <ArrowLeft size={20} />
                                <span>Volver a la lista</span>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-800">Detalle de Oficina</h1>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem label="Nombre" value={office.name} />
                                <DetailItem label="Código" value={office.code} />
                                <DetailItem label="Distrito" value={office.district?.name || 'N/A'} />
                                <DetailItem label="Estado" value={
                                    <span className={`status-badge ${office.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                        {office.status === 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                } />
                                <div className="md:col-span-2">
                                    <DetailItem label="Descripción" value={office.description || 'Sin descripción.'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
