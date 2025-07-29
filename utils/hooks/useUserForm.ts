"use client";

import { useState } from "react";
import type { RolUsuario, ProfileDB, CreateUserPayload } from "@/types";
import { useUserData } from "@/utils/hooks/useUserData";

export interface UserFormInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: RolUsuario;
  isActive: boolean;
}

export interface ProfileWithEmail extends ProfileDB {
  email: string;
}

interface UseUserFormProps {
  initialData?: ProfileWithEmail | null;
  onSuccess?: () => void;
}

export function convertCreateUserToProfileDB(
  user: CreateUserPayload,
  id: string
): ProfileDB {
  return {
    id,
    full_name: user.fullName,
    phone: user.phone ?? null,
    role: user.role,
    is_active: user.isActive,
  };
}

export function convertProfileDBToCreateUserPayload(
  user: ProfileWithEmail
): CreateUserPayload {
  return {
    email: user.email,
    password: "",
    fullName: user.full_name ?? "",
    phone: user.phone ?? undefined,
    role: user.role,
    isActive: user.is_active,
  };
}

export function useUserForm({
  initialData = null,
  onSuccess,
}: UseUserFormProps) {
  const isEditMode = Boolean(initialData);
  const { create, update } = useUserData();

  const [formData, setFormData] = useState<UserFormInput>(() => {
    if (initialData) {
      const payload = convertProfileDBToCreateUserPayload(initialData);
      return {
        email: payload.email,
        password: "",
        fullName: payload.fullName,
        phone: payload.phone ?? "",
        role: payload.role,
        isActive: payload.isActive,
      };
    } else {
      return {
        email: "",
        password: "",
        fullName: "",
        phone: "",
        role: "nuevo",
        isActive: true,
      };
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && initialData) {
        await update(initialData.id, {
          role: formData.role,
          is_active: formData.isActive,
        });
      } else {
        if (!formData.password) {
          setError("La contraseña es obligatoria para crear un usuario.");
          setLoading(false);
          return;
        }
        await create({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          isActive: formData.isActive,
        });
      }

      onSuccess?.();
    } catch (err) {
      console.error("Error en el formulario de usuario:", err);
      setError("Hubo un error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (initialData) {
      const payload = convertProfileDBToCreateUserPayload(initialData);
      setFormData({
        email: payload.email,
        password: "",
        fullName: payload.fullName,
        phone: payload.phone ?? "",
        role: payload.role,
        isActive: payload.isActive,
      });
    } else {
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        role: "nuevo",
        isActive: true,
      });
    }
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
    convertCreateUserToProfileDB,
  };
}
