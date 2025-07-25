'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import { ProfileForm } from '@/components/profiles/ProfileForm';
import { ProfileTable } from '@/components/profiles/ProfilesTable';

export default function ProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedProfile(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setSelectedProfile(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gestión de Perfiles</h1>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
          >
            Crear nuevo perfil
          </button>
        )}
      </div>

      <h2>hola SUperUsuario de Admin</h2>

      {showForm ? (
        <ProfileForm
          initialData={selectedProfile}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileTable onEdit={handleEdit} />
      )}
    </div>
  );
}
