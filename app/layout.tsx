import './globals.css';
import { Sidebar, SidebarProvider } from '@/components';
import { getUserWithProfile } from "@/lib/auth";
import { Providers } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userWithProfile = await getUserWithProfile();
  const role = userWithProfile?.role;

  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="antialiased font-sans bg-slate-100 text-slate-900" suppressHydrationWarning>
        {/* Excluir login de layout */}
        {userWithProfile ? (
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar role={role} />
              <main className="flex-1 p-6 overflow-y-auto">
                <Providers>
                  {children}
                </Providers>
              </main>
            </div>
          </SidebarProvider>
        ) : (
          <div className="min-h-screen">{children}</div>
        )}
      </body>
    </html>
  );
}
