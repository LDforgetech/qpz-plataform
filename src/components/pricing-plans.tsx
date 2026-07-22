"use client";
import { motion } from "framer-motion";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { usePlans } from "@/hooks/usePlans";
import type { Plan } from "@/types/subscription";

// ── Botão de Assinatura Dinâmico ────────────────────────────────────
// Verifica o status de login via useAuth() e renderiza:
// - Não logado: <SignInButton> que redireciona para /checkout/processing
// - Logado:    router.push() direto para /checkout/processing
// - Corporativo: link para contato (sem checkout)
function SubscribeButton({
  plan,
  highlighted,
}: {
  plan: Plan;
  highlighted: boolean;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  const redirectUrl = `/checkout/${plan.id}`;

  const buttonClasses = `w-full font-semibold ${
    highlighted
      ? "bg-accent text-accent-foreground hover:bg-gold-dark"
      : "bg-primary text-primary-foreground hover:bg-navy-light"
  }`;

  // Plano corporativo — redireciona para contato
  if (plan.price === "Sob consulta") {
    return (
      <Button className={buttonClasses} onClick={() => redirect("/contato")}>
        {plan.cta}
      </Button>
    );
  }

  // Skeleton enquanto o Clerk carrega
  if (!isLoaded) {
    return (
      <Button className={buttonClasses} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }

  // Usuário NÃO logado — abre modal de login e redireciona após
  if (!isSignedIn) {
    return (
      <SignUpButton mode="modal" forceRedirectUrl={redirectUrl}>
        <Button className={buttonClasses}>Assinar Plano</Button>
      </SignUpButton>
    );
  }

  // Usuário logado — redireciona direto para checkout
  return (
    <Button className={buttonClasses} onClick={() => redirect(redirectUrl)}>
      Assinar Plano
    </Button>
  );
}

// ── Skeleton de carregamento dos planos ──────────────────────────────
function PlansSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-8 bg-card border border-border animate-pulse"
        >
          <div className="h-6 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-2/3 mb-6" />
          <div className="h-10 bg-muted rounded w-1/2 mb-8" />
          <div className="space-y-3 mb-8">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 bg-muted rounded w-full" />
            ))}
          </div>
          <div className="h-10 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  );
}

// ── Componente Principal ────────────────────────────────────────────
const PricingPlans = () => {
  const { data: plans, isLoading, isError } = usePlans();
  return (
    <section id="planos" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Invista no seu Crescimento
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu momento de carreira. Todos incluem
            acesso imediato.
          </p>
        </motion.div>

        {isLoading && <PlansSkeleton />}

        {isError && (
          <div className="text-center text-muted-foreground">
            <p>
              Não foi possível carregar os planos. Tente novamente mais tarde.
            </p>
          </div>
        )}

        {plans && (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] scale-[1.03]"
                    : "bg-card border border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                      <Sparkles size={12} /> Mais Escolhido
                    </span>
                  </div>
                )}

                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p
                  className={`text-sm mt-1 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>

                <div className="mt-6 mb-8">
                  {plan.price !== "Sob consulta" ? (
                    <>
                      <span
                        className={`text-sm ${plan.highlighted ? "text-primary-foreground/30" : "text-muted-foreground"}`}
                      >
                        em até 12x de
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm">R$</span>
                        <span className="text-4xl font-bold font-display leading-7">
                          {(+plan.price / 12).toFixed(2)}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${plan.highlighted ? "text-primary-foreground/30" : "text-muted-foreground"}`}
                      >
                        ou à vista por R$ {plan.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold font-display">
                      {plan.price}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${plan.highlighted ? "text-accent" : "text-accent"}`}
                      />
                      <span>{f.item}</span>
                    </li>
                  ))}
                </ul>
                <SubscribeButton plan={plan} highlighted={plan.highlighted} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPlans;
