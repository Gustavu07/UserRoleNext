'use server'
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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return encodedRedirect("error", "/login", error.message);
    }

    return redirect("/");
};


// Sign out
export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
}
