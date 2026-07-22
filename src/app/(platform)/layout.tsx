import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api";
import type { SubscriptionStatusResponse } from "@/types/subscription";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();

  // 1. Proteção de Autenticação (Garantia adicional ao middleware)
  if (!userId) {
    redirect("/");
  }

  // 2. Blindagem de Assinatura — verificação server-side em tempo real
  // Consulta a API do backend para checar se o usuário tem assinatura ativa.
  // cache: 'no-store' garante leitura em tempo real a cada request.
  let isActive = false;

  try {
    const token = await getToken();

    if (!token) {
      redirect("/#planos");
    }

    const status = await serverFetch<SubscriptionStatusResponse>(
      "student/status",
      token,
      { cache: "no-store" },
    );

    isActive = status.is_active;
  } catch {
    // Erro de rede ou API — redireciona por segurança.
    // Isso garante que usuários sem assinatura ou com instabilidade
    // de rede não acessem conteúdo premium indevidamente.
    isActive = false;
  }

  if (!isActive) {
    redirect("/#planos");
  }

  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
