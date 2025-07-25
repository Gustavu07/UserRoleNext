// @/components/profiles/ProfileTable.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { Profile } from "@/types";
import { useProfilesData } from "@/utils/hooks/admin/users/useProfileData";

interface ProfileTableProps {
  onEdit: (profile: Profile) => void;
}

export function ProfileTable({ onEdit }: ProfileTableProps) {
  const { getProfiles } = useProfilesData();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getProfiles]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p className="text-center py-4">Cargando perfiles...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Error: {error}</p>;
  if (profiles.length === 0) return <p className="text-center py-4">No hay perfiles registrados.</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-4 py-2 text-left">Nombre</th>
            <th className="border px-4 py-2 text-left">Teléfono</th>
            <th className="border px-4 py-2 text-left">Rol</th>
            <th className="border px-4 py-2 text-left">Activo</th>
            <th className="border px-4 py-2 text-left">Creado</th>
            <th className="border px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{profile.full_name || "-"}</td>
              <td className="border px-4 py-2">{profile.phone || "-"}</td>
              <td className="border px-4 py-2 capitalize">{profile.role}</td>
              <td className="border px-4 py-2">{profile.is_active ? "Sí" : "No"}</td>
              <td className="border px-4 py-2">
                {new Date(profile.created_at).toLocaleDateString("es-BO")}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEdit(profile)}
                  className="text-blue-600 underline text-xs hover:text-blue-800"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
