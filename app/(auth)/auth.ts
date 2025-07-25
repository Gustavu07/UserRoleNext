"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

// Log-in Action
export const logInAction = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // Construir email automáticamente
  // const email = `${username}@mail.com`;
  const email = username;

  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (loginError || !loginData.user) {
    return encodedRedirect(
      "error",
      "/login",
      loginError?.message || "Error al iniciar sesión"
    );
  }

  const userId = loginData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return encodedRedirect(
      "error",
      "/login",
      "No se pudo obtener el perfil del usuario"
    );
  }

  const role = profile.role;

  switch (role) {
    case "superadmin":
      return redirect("/admin");
    case "almacen":
      return redirect("/almacen");
  }
};

// Sign out
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
