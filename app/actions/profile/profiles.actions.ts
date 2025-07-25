"use server";

import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/types/index";

// Obtener todos los perfiles
export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Obtener un perfil por su ID
export async function getProfileById(id: string): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Crear un nuevo perfil (esto normalmente lo haría el backend/sistema al crear usuario)
export async function createProfile(
  input: Omit<Profile, "id" | "created_at">
): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Actualizar un perfil
export async function updateProfile(
  id: string,
  input: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Eliminar un perfil (poco común por relación con auth, pero útil si lo decides)
export async function deleteProfile(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

// Crear un usuario en Auth + su perfil
interface CreateUserWithProfileInput {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: Profile["role"];
  is_active: boolean;
}

export async function createUserWithProfile(
  input: CreateUserWithProfileInput
): Promise<void> {
  const supabase = await createClient();

  // 1. Crear usuario en Auth
  const { data: user, error: authError } = await supabase.auth.admin.createUser(
    {
      email: input.email,
      password: input.password,
      email_confirm: true,
    }
  );

  if (authError || !user?.user?.id) {
    throw new Error("Error al crear el usuario en Auth: " + authError?.message);
  }

  const userId = user.user.id;

  // 2. Insertar en tabla profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: input.full_name,
    phone: input.phone,
    role: input.role,
    is_active: input.is_active,
  });

  if (profileError) {
    throw new Error("Error al crear el perfil: " + profileError.message);
  }
}
