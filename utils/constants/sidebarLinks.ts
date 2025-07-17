import {
  WrenchIcon,
  ChartBarIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  NumberedListIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { signOutAction } from "@/app/(auth)/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isAction?: false;
  action?: never;
}

interface ActionItem {
  label: string;
  icon: React.ElementType;
  isAction: true;
  action: () => Promise<void>;
  href?: never;
}

type SidebarItem = NavItem | ActionItem;

interface NavSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarNavigation: NavSection[] = [
  {
    title: "General",
    items: [{ href: "/", label: "Dashboard", icon: ChartBarIcon }],
  },
  {
    title: "Sesión",
    items: [
      {
        label: "Cerrar Sesión",
        icon: XCircleIcon,
        isAction: true,
        action: signOutAction,
      },
    ],
  },
];
