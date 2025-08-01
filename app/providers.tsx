// app/providers.tsx
'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider>
        <h1>hola gustavo</h1>
        <ToastProvider placement={'top-center'} />
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  )
}