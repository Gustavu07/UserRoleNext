export type UserRole =
  | "superadmin"
  | "almacen"
  | "ventas"
  | "contabilidad"
  | "nuevo";

//user
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole | null;
  created_at: string;
  is_active: boolean | null;
}
