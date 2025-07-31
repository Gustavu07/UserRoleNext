'use client';

import { useState } from 'react';
import type { ProfileDB, CreateUserPayload } from '@/types';
import { UserForm } from '@/components/users/UserForm';
import { UserTable } from '@/components/users/UserTable';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<(ProfileDB & { email: string }) | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: ProfileDB & { email: string }) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  // Función para convertir al formato que espera UserForm
  function convert(profile: ProfileDB & { email: string }): CreateUserPayload {
    return {
      id: profile.id,
      email: profile.email,
      password: "", // Vacío en edición
      fullName: profile.full_name ?? "",
      phone: profile.phone ?? undefined,
      role: profile.role,
      isActive: profile.is_active,
    };
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
      </div>

      {showForm ? (
        <UserForm
          initialData={selectedUser ? convert(selectedUser) : undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <UserTable
          onEdit={handleEdit}
          onAddNew={handleCreate}
        />
      )}
    </div>
  );
}
