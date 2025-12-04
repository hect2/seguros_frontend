import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { useAuthStore } from "@/auth/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import { toast } from "sonner";

export default function Profile() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    dpi: user?.dpi ?? "",
    phone: user?.phone ?? "",
    role_id: null,
  });

  // Cargar datos al abrir la pantalla
  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      dpi: user?.dpi ?? "",
      phone: user?.phone ?? "",
      role_id: null,
    });
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put(`/users/${user.id}`, payload);
      return data.data; // tu backend retorna { data: {...} }
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      useAuthStore.setState({ user: updatedUser });

      // 🔹 Actualizar el form con los valores retornados
      setForm({
        name: updatedUser.name,
        email: updatedUser.email,
        dpi: updatedUser.dpi ?? "",
        phone: updatedUser.phone ?? "",
        role_id: updatedUser.role_id ?? null,
      });

      toast.success("Perfil actualizado");
      setEditing(false);
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message ?? "Error al actualizar");
    },
  });

  const handleChange = (e: any) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.dpi.trim()) {
      toast.error("Nombre, correo y DPI son obligatorios");
      return;
    }
    console.log(form)
    mutation.mutate({
      name: form.name,
      email: form.email,
      dpi: form.dpi,
      phone: form.phone,
      role_id: form.role_id || null,
    });
  };

  const handleCancel = () => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      dpi: user?.dpi ?? "",
      phone: user?.phone ?? "",
      role_id: user?.role_id ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"
          } lg:ml-64`}
      >
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6 lg:p-10">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-gray-600 mb-6">Información personal del usuario</p>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input
                  name="name"
                  disabled={!editing}
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border rounded-lg ${editing ? "bg-white border-blue-400" : "bg-gray-100"
                    }`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  disabled={true}
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border rounded-lg ${editing ? "bg-white border-blue-400" : "bg-gray-100"
                    }`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">DPI</label>
                <input
                  name="dpi"
                  disabled={!editing}
                  value={form.dpi}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border rounded-lg ${editing ? "bg-white border-blue-400" : "bg-gray-100"
                    }`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Teléfono</label>
                <input
                  name="phone"
                  disabled={!editing}
                  value={form.phone ?? ""}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border rounded-lg ${editing ? "bg-white border-blue-400" : "bg-gray-100"
                    }`}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Rol del Usuario</label>
                <input
                  name="role"
                  disabled={true}
                  value={user?.role_names[0] ?? ""}
                  className={`mt-1 w-full p-2 border rounded-lg bg-gray-100`}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626]"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={mutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {mutation.isLoading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
