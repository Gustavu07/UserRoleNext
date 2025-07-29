import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { RolUsuario } from "@/types/index";

const RUTAS_PROTEGIDAS: Record<string, RolUsuario[]> = {
  "/Admin": ["superadmin"],
  "/inventory": ["superadmin", "almacen"],
};

async function getUserProfile(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    role: data.role as RolUsuario,
    isActive: data.is_active ?? true,
  };
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  const currentPath = request.nextUrl.pathname;

  if (!user && currentPath !== "/login" && currentPath !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    const profile = await getUserProfile(supabase, user.id);
    if (!profile || !profile.isActive) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    for (const [ruta, rolesPermitidos] of Object.entries(RUTAS_PROTEGIDAS)) {
      if (
        currentPath.startsWith(ruta) &&
        !rolesPermitidos.includes(profile.role)
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (currentPath === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
