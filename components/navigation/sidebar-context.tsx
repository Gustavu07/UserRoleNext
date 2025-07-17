'use client';
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext<any>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isOpen = !collapsed || hovered;

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, hovered, setHovered, isOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
