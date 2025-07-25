'use client';

import React from 'react';
import { useProfileForm } from '@/utils/hooks/admin/users/useProfileForm';
import type { Profile, UserRole } from '@/types';

interface ProfileFormProps {
  initialData?: Profile | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Usuario', value: 'user' },
  { label: 'Invitado', value: 'guest' },
  { label: 'Nuevo', value: 'nuevo' },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isEditMode,
    resetForm,
  } = useProfileForm({
    initialData,
    onSuccess: () => {
      alert(isEditMode ? 'Perfil actualizado' : 'Usuario creado');
      onSuccess?.();
    },
  });

  const handleCancelClick = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      {!isEditMode && (
        <>
          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@correo.com"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="full_name" className="block font-semibold mb-1">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          name="full_name"
          id="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Nombre del usuario"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block font-semibold mb-1">
          Teléfono
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+591 70000000"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="role" className="block font-semibold mb-1">
          Rol <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          id="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecciona un rol</option>
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            handleChange({
              target: {
                name: 'is_active',
                type: 'checkbox',
                checked: e.target.checked,
              },
            } as any)
          }
          className="h-5 w-5 text-blue-600"
        />
        <label htmlFor="is_active" className="font-medium">
          Usuario activo
        </label>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
