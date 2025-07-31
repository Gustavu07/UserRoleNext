'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ProfileWithEmail } from '@/types';
import { useUserData } from '@/utils/hooks/useUserData';

interface UserTableProps {
  onEdit: (user: ProfileWithEmail) => void;
  onAddNew: () => void;
}

export function UserTable({ onEdit, onAddNew }: UserTableProps) {
  const [users, setUsers] = useState<ProfileWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getUsers, remove } = useUserData();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data as ProfileWithEmail[]);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  }, [getUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await remove(id);
        await fetchUsers();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        alert('Hubo un error al eliminar el usuario');
      }
    },
    [remove, fetchUsers]
  );

  if (loading) return <p className="text-center py-4">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Usuarios</h2>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Usuario
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Correo electrónico</th>
            <th className="border px-4 py-2">Nombre Completo</th>
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Rol</th>
            <th className="border px-4 py-2">Activo</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            <>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.full_name ?? '-'}</td>
                  <td className="border px-4 py-2">{user.phone ?? '-'}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">{user.is_active ? 'Sí' : 'No'}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
