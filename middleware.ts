import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 👉 Tipos de roles válidos
type RolUsuario =
  | "superadmin"
  | "almacen"
  | "ventas"
  | "contabilidad"
  | "nuevo";

// 👉 Configuración de rutas protegidas por rol
const RUTAS_PROTEGIDAS: Record<string, RolUsuario[]> = {
  "/Admin": ["superadmin"], // Solo superadmin puede acceder a Admin
  "/almacen": ["superadmin", "almacen"], // superadmin y almacen
  /*"/ventas": ["superadmin", "ventas"], // superadmin y ventas
  "/contabilidad": ["superadmin", "contabilidad"], // superadmin y contabilidad
  "/dashboard": ["superadmin", "almacen", "ventas", "contabilidad"],*/ // Todos excepto nuevo
};

// 👉 Función para obtener el perfil del usuario
async function getUserProfile(supabase: any, userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      console.error("❌ Error al obtener perfil:", error);
      return null;
    }

    return {
      role: profile.role as RolUsuario,
      isActive: profile.is_active ?? true,
    };
  } catch (error) {
    console.error("❌ Error en getUserProfile:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 🔐 Obtener usuario autenticado
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  const currentPath = request.nextUrl.pathname;

  // 🔹 Redirigir a /login si el usuario no está autenticado y quiere entrar a rutas protegidas
  if (!user && currentPath !== "/login" && currentPath !== "/") {
    console.log("🚫 Usuario no autenticado, redirigiendo a login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔹 Si el usuario está autenticado, verificar permisos por rol
  if (user) {
    // Obtener perfil del usuario
    const profile = await getUserProfile(supabase, user.id);

    if (!profile) {
      console.log("❌ No se pudo obtener el perfil del usuario");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificar si el usuario está activo
    if (!profile.isActive) {
      console.log("🚫 Usuario inactivo, redirigiendo a login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 🔍 Verificar permisos para rutas específicas
    for (const [ruta, rolesPermitidos] of Object.entries(RUTAS_PROTEGIDAS)) {
      if (currentPath.startsWith(ruta)) {
        if (!rolesPermitidos.includes(profile.role)) {
          console.log(
            `🚫 Acceso denegado: ${profile.role} no puede acceder a ${ruta}`
          );
          // Redirigir a una página de acceso denegado o al dashboard
          return NextResponse.redirect(new URL("/", request.url));
        }
        console.log(
          `✅ Acceso permitido: ${profile.role} accediendo a ${ruta}`
        );
        break;
      }
    }

    // 🔹 Si el usuario está autenticado y va a /login, redirigir al dashboard
    if (currentPath === "/login") {
      console.log("✅ Usuario autenticado, redirigiendo al dashboard");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

// 🔹 Aplicar middleware a todas las rutas menos archivos estáticos e imágenes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
