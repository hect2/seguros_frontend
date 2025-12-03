import React from 'react';
import { User } from '@/modules/users/interfaces/user';
import { useUsersList } from '@/seguros/hooks/useUsersList';

interface AssignUserPopoverProps {
  onSelectUser: (userId: number) => void;
  currentAssignee?: string;
}

export function AssignUserPopover({ onSelectUser, currentAssignee }: AssignUserPopoverProps) {
  const { data, isLoading } = useUsersList();
  const users: User[] = data?.data ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    if (!isNaN(userId)) {
      onSelectUser(userId);
    }
  };

  return (
    <div className="w-full">
      <select
        onChange={handleChange}
        className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        defaultValue=""
      >
        <option value="" disabled>
          {currentAssignee || "Asignar responsable"}
        </option>

        {isLoading && <option> Cargando usuarios... </option>}

        {!isLoading && users.length === 0 && (
          <option disabled>No hay usuarios disponibles</option>
        )}

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
