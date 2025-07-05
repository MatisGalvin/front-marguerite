"use client";

import { useMe } from "@/hooks/api";
import { SidebarMenu } from "./components/sidebar-menu/sidebar-menu";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <SidebarMenu>{children}</SidebarMenu>;
}
