'use client';

import React from 'react';
import { useUserForm } from '@/utils/hooks/useUserForm';
import { addToast, Button, Form, Input, Select, Switch } from '@heroui/react';
import type { CreateUserPayload, RolUsuario } from '@/types';

interface Props {
  initialData?: CreateUserPayload | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<Props> = ({
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
  } = useUserForm({
    initialData: initialData as any, // Ajusta según cómo pases initialData
    onSuccess: () => {
      addToast({
        title: isEditMode ? 'Usuario actualizado' : 'Usuario creado',
        description: 'El usuario se ha guardado correctamente.',
        color: 'default',
        timeout: 3000,
      });

      onSuccess?.();
    },
  });

  const roles: RolUsuario[] = [
    'superadmin',
    'almacen',
    'ventas',
    'contabilidad',
    'nuevo',
  ];

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
  isRequired
  errorMessage={error}
  label="Correo electrónico"
  name="email"
  placeholder="correo@ejemplo.com"
  type="email"
  value={formData.email}
  onChange={handleChange}
  disabled={isEditMode}
/>

      <Input
        isRequired={!isEditMode}
        errorMessage={error}
        label="Contraseña"
        name="password"
        placeholder={isEditMode ? '******** (mantener)' : '********'}
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Input
        isRequired
        errorMessage={error}
        label="Nombre completo"
        name="fullName"
        placeholder="Juan Pérez"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
      />

      <Input
        label="Teléfono"
        name="phone"
        placeholder="777-12345"
        type="tel"
        value={formData.phone ?? ''}
        onChange={handleChange}
      />

      <label htmlFor="role" className="block text-sm font-medium mb-1">
  Rol
</label>
<select
  required
  id="role"
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded px-3 py-2"
>
  <option value="" disabled>
    Selecciona un rol
  </option>
  {roles.map((rol) => (
    <option key={rol} value={rol}>
      {rol}
    </option>
  ))}
</select>


      <Switch
        name="isActive"
        isSelected={formData.isActive}
        onChange={(e) =>
          handleChange({
            target: {
              name: 'isActive',
              type: 'checkbox',
              checked: e.target.checked,
            },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      >
        Usuario activo
      </Switch>

      <div className="flex gap-2 mt-4">
        <Button color="primary" type="submit" disabled={loading}>
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>

        {onCancel && (
          <Button
            color="danger"
            onPress={() => {
              resetForm();
              onCancel();
            }}
          >
            Cancelar
          </Button>
        )}
      </div>
    </Form>
  );
};
