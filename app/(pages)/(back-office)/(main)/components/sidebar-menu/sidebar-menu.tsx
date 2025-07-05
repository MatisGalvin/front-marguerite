"use client";

import {
  Barcode,
  LayoutDashboard,
  LucideIcon,
  Package,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import { BadgeNotification } from "@/components/ui/badge-notification";
import { Logo } from "@/components/ui/logo";
import { APP_NAME } from "@/constants/app-info";
import { ROUTES } from "@/constants/routes";
import { usePurchasesMe } from "@/hooks/api";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { useEffect } from "react";
import { SocketEvents, socket } from "@/lib/socket";
import { StrapiSingleResult } from "@/types/strapi.type";
import { Purchase } from "@/types/purchase.type";
import { queryClient } from "@/lib/react-query";
import { Sale } from "@/types/sale.type";
interface SidebarMenuProps {
  children: React.ReactNode;
}

export function SidebarMenu(p: SidebarMenuProps) {
  const path = usePathname();
  const { data: purchases = [], refetch } = usePurchasesMe();

  const refetchPurchasesAndSales = async ({
    data,
  }: StrapiSingleResult<Omit<Purchase | Sale, "id">>) => {
    await queryClient.invalidateQueries({ queryKey: ["purchases"] });
    queryClient.invalidateQueries({ queryKey: ["sales"] });
  };

  const refreshClients = async () => {
    await queryClient.invalidateQueries({ queryKey: ["clients"] });
  };
  useEffect(() => {
    socket.on(SocketEvents.PURCHASE_CREATE, refetchPurchasesAndSales);
    socket.on(SocketEvents.PURCHASE_UPDATE, refetchPurchasesAndSales);
    socket.on(SocketEvents.SALE_UPDATE, refetchPurchasesAndSales);
    socket.on(SocketEvents.CLIENT_CREATE, refreshClients);
    socket.on(SocketEvents.CLIENT_UPDATE, refreshClients);
    return () => {
      socket.off(SocketEvents.PURCHASE_CREATE);
      socket.off(SocketEvents.SALE_UPDATE);
    };
  }, []);

  const LINKS: {
    title: string;
    label?: string;
    icon: LucideIcon;
    uri: string;
    notificationCount?: number;
  }[] = [
    {
      title: "Périodes de ventes",
      icon: ShoppingCartIcon,
      uri: ROUTES.sales,
    },
    {
      title: "Mes clients",
      icon: UsersIcon,
      uri: ROUTES.clients,
    },
    {
      title: "Mes commandes",
      icon: Package,
      uri: ROUTES.purchases,
      notificationCount: purchases.filter(
        (purchase) => !purchase.is_seen_by_user,
      ).length,
    },
    {
      title: "Mes produits",
      icon: Barcode,
      uri: ROUTES.products,
    },
  ];

  const logo = (
    <div className="flex h-[60px] items-center justify-center border-b">
      <Link
        className="flex items-center gap-2 font-semibold"
        href={ROUTES.dashboard}
      >
        <Logo />
        <span className="hidden lg:block">{APP_NAME}</span>
      </Link>
    </div>
  );

  const navLinks = (
    <nav className="my-2 grid items-start gap-2 px-4 text-sm font-medium ">
      {LINKS.map((link) => (
        <Link
          key={link.uri}
          className={`
          ${
            path === link.uri ? " bg-gray-200 text-gray-900" : "  text-gray-500"
          }  
          relative flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-200/50 hover:text-gray-900 `}
          href={link.uri}
        >
          <div className="flex items-center gap-2">
            <link.icon />
            <span className="hidden whitespace-nowrap lg:block">
              {link.title}
            </span>
          </div>
          {link.notificationCount !== undefined &&
            link.notificationCount > 0 && (
              <BadgeNotification
                count={link.notificationCount}
                className="absolute -right-1 -top-2 lg:relative lg:right-auto lg:top-auto"
              />
            )}
        </Link>
      ))}
    </nav>
  );
  return (
    <div className="flex min-h-screen w-full ">
      <div className=" flex flex-col  gap-2 border-r bg-gray-100/40">
        {logo}
        {navLinks}
      </div>
      <div className="flex w-full flex-col ">
        <Header />
        <main className="p-4">{p.children}</main>
      </div>
    </div>
  );
}
