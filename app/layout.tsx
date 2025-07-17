'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarProvider } from '@/components';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Excluir página de login
  if (pathname === '/login') {
    return (
      <html lang="es">
        <body className="antialiased font-sans bg-slate-100 text-slate-900">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="es" className="h-full" suppressHydrationWarning >
      <body className="antialiased font-sans bg-slate-100 text-slate-900" suppressHydrationWarning >
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
              <Providers>
                {children}
              </Providers>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
