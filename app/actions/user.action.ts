"use server";

import { createClient } from "@/utils/supabase/server";
import { RolUsuario, ProfileWithEmail } from "@/types";

export async function getAllUsers(): Promise<ProfileWithEmail[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_all_users_with_email");

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return [];
  }

  return data || [];
}

export async function createUser(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: RolUsuario;
  isActive: boolean;
}) {
  const supabase = await createClient();

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (signUpError) {
    console.error("Error al crear cuenta:", signUpError.message);
    throw new Error(signUpError.message);
  }

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error("No se pudo obtener el ID del nuevo usuario.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: input.fullName,
    phone: input.phone ?? null,
    role: input.role,
    is_active: input.isActive,
  });

  if (profileError) {
    console.error("Error al crear perfil:", profileError.message);
    throw new Error(profileError.message);
  }

  return { message: "Usuario creado exitosamente." };
}

export async function updateUserRole(
  id: string,
  input: { role: RolUsuario; is_active: boolean }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar usuario:", error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteUser(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar usuario:", error.message);
    throw new Error(error.message);
  }
}
