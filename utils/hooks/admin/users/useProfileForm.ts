"use client";

import { useState } from "react";
import type { Profile, UserRole } from "@/types";
import { useProfilesData } from "@/utils/hooks/admin/users/useProfileData";
import { createUserWithProfile } from "@/app/actions/profile/profiles.actions";

interface UseProfileFormProps {
  initialData?: Profile | null;
  onSuccess?: () => void;
}

const initialFormState = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
  role: "nuevo" as UserRole,
  is_active: true,
};

export function useProfileForm({
  initialData = null,
  onSuccess,
}: UseProfileFormProps) {
  const isEditMode = Boolean(initialData);
  const { updateUserProfile } = useProfilesData();

  const [formData, setFormData] = useState({
    ...initialFormState,
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "nuevo",
    is_active: initialData?.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const val = type === "checkbox" ? target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        // Modo edición: solo actualiza el perfil
        await updateUserProfile(initialData.id, {
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
          is_active: formData.is_active,
        });
      } else {
        // Validación simple para crear usuario
        if (!formData.email || !formData.password) {
          setError("El correo y la contraseña son obligatorios.");
          setLoading(false);
          return;
        }

        await createUserWithProfile({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
          is_active: formData.is_active,
        });
      }

      onSuccess?.();
    } catch (err: any) {
      console.error("Error en el formulario de usuario:", err);
      setError(err?.message || "Ocurrió un error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormState,
    });
    setError(null);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isEditMode,
    resetForm,
  };
}
