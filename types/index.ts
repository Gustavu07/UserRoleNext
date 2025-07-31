import { User } from "@supabase/supabase-js";

export type RolUsuario =
  | "superadmin"
  | "almacen"
  | "ventas"
  | "contabilidad"
  | "nuevo";

export interface ProfileDB {
  // Este representa lo que viene desde la tabla 'profiles'
  id: string; // igual al user.id
  full_name: string | null;
  phone: string | null;
  role: RolUsuario;
  is_active: boolean;
}

export interface Profile {
  user: User;
  role: RolUsuario;
  isActive: boolean;
  fullName: string | null;
  phone: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: RolUsuario;
  isActive: boolean;
}

export interface ProfileWithEmail {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: RolUsuario;
  is_active: boolean;
}
