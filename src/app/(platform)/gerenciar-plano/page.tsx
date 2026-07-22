"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Loader2,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  CalendarClock,
  TriangleAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { usePlans } from "@/hooks/usePlans";
import { useCheckout } from "@/hooks/useCheckout";
import { api } from "@/lib/api";
import type { Plan } from "@/types/subscription";
import { CancelSubscriptionDialog } from "@/components/cancel-subscription-dialog";

// ── Helpers ─────────────────────────────────────────────────────────

const formatBRL = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return value as string;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ── Skeleton ────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8 animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
      </div>
      <div className="h-40 rounded-2xl bg-muted" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

// ── Componente Principal ────────────────────────────────────────────

export default function PlanPage() {
  const router = useRouter();
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);
  // Dados reais da API
  const {
    data: subscription,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus,
  } = useSubscriptionStatus();
  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
  } = usePlans();
  const checkout = useCheckout();

  // ── Derivados seguros ──────────────────────────────────────────
  const isFixed = subscription?.access_type === "fixed";
  // ── Ações ───────────────────────────────────────────────────────
  const openBillingPortal = async () => {
    if (billingPortalLoading) return;
    setBillingPortalLoading(true);

    try {
      const data = await api.post<{ url: string }>("billing-portal", {});
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Não foi possível abrir o portal de cobrança.");
      }
    } catch {
      toast.error("Erro ao abrir o portal de cobrança. Tente novamente.");
    } finally {
      setBillingPortalLoading(false);
    }
  };

  const handleRenewAccess = (planId: number) => {
    router.push(`/checkout/${planId}`);
  };

  const handleChangePlan = (targetPlanId: number) => {
    if (isFixed) {
      // Para acesso fixo, redireciona para o fluxo de checkout padrão
      handleRenewAccess(targetPlanId);
      return;
    }

    // Para recurring, abre o portal de cobrança do Stripe
    openBillingPortal();
  };

  // ── Loading / Error ─────────────────────────────────────────────

  if (statusLoading || plansLoading) return <PageSkeleton />;

  if (statusError || !subscription) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-card p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Não foi possível carregar seus dados
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Houve um problema ao buscar as informações da sua assinatura.
            Verifique sua conexão e tente novamente.
          </p>
          <Button
            onClick={() => refetchStatus()}
            className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground voyage 2.0transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar
        </Link>

        <h1 className="text-3xl font-display font-bold text-foreground">
          {isFixed ? "Gerenciar acesso" : "Gerenciar assinatura"}
        </h1>

        <p className="mt-1 text-muted-foreground">
          {isFixed
            ? "Visualize seu plano atual e renove seu acesso quando necessário."
            : "Altere seu plano, atualize seu pagamento ou cancele quando quiser."}
        </p>
      </motion.div>

      {/* ── Card do Plano Atual ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-10"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-navy-dark p-6 text-primary-foreground md:p-8">
          <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Plano atual
                </span>
              </div>

              <h2 className="text-3xl font-display font-bold">
                {subscription.plan_name ?? "Plano"}
              </h2>

              {/* Linha de cobrança/expiração — adaptada por access_type */}
              <p className="mt-1 text-sm opacity-80">
                {subscription.plan_price && (
                  <>{formatBRL(subscription.plan_price)} · </>
                )}

                {isFixed && subscription.access_expires_at && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock size={14} className="inline" />
                    Seu acesso expira em{" "}
                    {formatDate(subscription.access_expires_at)}
                  </span>
                )}
              </p>

              {subscription.member_since && (
                <p className="mt-1 text-xs opacity-60">
                  Assinante desde {formatDate(subscription.member_since)}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Trocar de Plano / Renovar Acesso ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-10"
      >
        <h2 className="mb-1 text-xl font-display font-bold text-foreground">
          {isFixed ? "Renovar ou trocar de plano" : "Trocar de plano"}
        </h2>

        <p className="mb-5 text-sm text-muted-foreground">
          {isFixed
            ? "Selecione um plano para comprar um novo período de acesso."
            : "A mudança é aplicada imediatamente e cobrada proporcionalmente."}
        </p>

        {plansError && (
          <div className="text-center text-muted-foreground py-8">
            <p>
              Não foi possível carregar os planos. Tente novamente mais tarde.
            </p>
          </div>
        )}

        {plans && (
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((tier: Plan) => {
              const isCurrent = tier.name === subscription.plan_name;

              // Plano corporativo — não exibe na grid
              if (tier.price === "Sob consulta") return null;

              return (
                <div
                  key={tier.id}
                  className={cn(
                    "flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md",
                    isCurrent
                      ? "border-accent shadow-[var(--shadow-gold)]"
                      : "border-border",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground">
                      {tier.name}
                    </h3>

                    {isCurrent && (
                      <Badge className="bg-accent text-[10px] text-accent-foreground hover:bg-accent">
                        Atual
                      </Badge>
                    )}
                  </div>

                  <p className="mb-4 text-xs text-muted-foreground">
                    {tier.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-2xl font-display font-bold text-foreground">
                      {formatBRL(tier.price)}
                    </span>
                  </div>

                  <ul className="mb-5 flex-1 space-y-2">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.item}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        {feature.item}
                      </li>
                    ))}
                  </ul>

                  {/* Botão adaptado por access_type */}
                  {isFixed ? (
                    <Button
                      onClick={() => handleRenewAccess(tier.id)}
                      disabled={checkout.isPending}
                      className="w-full"
                    >
                      {checkout.isPending ? (
                        <Loader2 size={14} className="mr-1 animate-spin" />
                      ) : (
                        <ShoppingCart size={14} className="mr-1" />
                      )}
                      {isCurrent ? "Renovar Acesso" : "Comprar Novo Acesso"}
                    </Button>
                  ) : (
                    <Button
                      disabled={isCurrent}
                      variant={isCurrent ? "secondary" : "default"}
                      onClick={() => handleChangePlan(tier.id)}
                      className="w-full"
                    >
                      {isCurrent ? "Plano atual" : "Alterar para este plano"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* ── Nota informativa para acesso fixo ────────────────────── */}
      {isFixed && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <TriangleAlertIcon size={18} />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                Deseja solicitar o cancelamento da sua assinatura?
              </p>

              <p className="text-sm text-muted-foreground mb-4 mt-2">
                O cancelamento com reembolso está disponível apenas para
                solicitações realizadas em até{" "}
                <strong>7 (sete) dias corridos</strong>, contados a partir da
                confirmação do pagamento, previsto em nossos{" "}
                <Link
                  href="/termos-e-politicas"
                  className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                >
                  Termos de Uso e Política de Reembolso
                </Link>
                . Após esse período, não será possível solicitar o reembolso do
                plano.
              </p>
              {!statusLoading && subscription && (
                <CancelSubscriptionDialog
                  paymentMethod={subscription.payment_type}
                >
                  <Button variant="destructive">Cancelar Assinatura</Button>
                </CancelSubscriptionDialog>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
