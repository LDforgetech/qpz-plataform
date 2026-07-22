"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Versão expandida */}
        <div className="bg-gradient-to-br from-primary to-navy-dark rounded-2xl p-5 text-white group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 tracking-wide text-accent">
            <Bookmark className="text-accent" size={17} />
            <p>Nome do plano</p>
          </div>

          {/* <p className="mt-3 text-sm font-medium leading-5 text-white/75">
            Acesso liberado por mais 832 dias
          </p> */}

          <Button className="mt-4 h-8 w-full bg-accent font-semibold text-slate-950 hover:bg-accent/90">
            <Link href="/gerenciar-plano">Gerenciar plano</Link>
          </Button>
        </div>

        {/* Versão colapsada */}
        <SidebarMenuButton
          asChild
          tooltip="Gerenciar plano"
          className="hidden group-data-[collapsible=icon]:flex"
        >
          <div className="bg-gradient-to-br from-primary to-navy-dark rounded-2xl">
            <Link href="/gerenciar-plano">
              <Bookmark className="text-accent" />
              <span className="sr-only">Gerenciar plano</span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
