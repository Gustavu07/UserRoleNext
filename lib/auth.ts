"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

// 👉 Enum de roles válidos
export type RolUsuario =
  | "superadmin"
  | "almacen"
  | "ventas"
  | "contabilidad"
  | "nuevo";

// 👉 Tipo de usuario extendido con perfil
export interface UsuarioConRol {
  user: User;
  role: RolUsuario;
  isActive: boolean;
  fullName: string | null;
  phone: string | null;
}

// 🔐 Obtener el usuario logueado junto a su perfil extendido
export const getUserWithProfile = async (): Promise<UsuarioConRol | null> => {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.warn("⚠️ No se encontró sesión activa o hubo error");
    return null;
  }

  const user = authData.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active, full_name, phone")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("❌ Error al obtener el perfil extendido:", profileError);
    return null;
  }

  return {
    user,
    role: profile.role as RolUsuario,
    isActive: profile.is_active ?? true,
    fullName: profile.full_name,
    phone: profile.phone,
  };
};

// 🔓 Login
export const logInAction = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (error) {
    console.error("❌ Login error:", error);
    return encodedRedirect("error", "/login", error.message);
  }

  console.log("✅ LOGIN SUCCESS");
  console.log("👤 Usuario:", data.user);
  console.log("🔐 Access Token:", data.session?.access_token);

  return redirect("/");
};

// 🔒 Logout
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  console.log("👋 Usuario deslogueado correctamente");
  return redirect("/login");
};
