"use client";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Essencial",
    price: "79",
    description: "Para profissionais que querem começar sua jornada em RH.",
    features: [
      "Acesso a 15+ cursos básicos",
      "Certificados digitais",
      "Comunidade de alunos",
      "Suporte por e-mail",
      "Atualizações mensais",
    ],
    highlighted: false,
    cta: "Começar Grátis por 7 dias",
  },
  {
    name: "Profissional",
    price: "149",
    description: "Para quem busca se destacar e crescer na carreira de RH.",
    features: [
      "Acesso a todos os 50+ cursos",
      "Certificados reconhecidos",
      "Mentorias em grupo mensais",
      "Suporte prioritário",
      "Materiais complementares",
      "Acesso a eventos exclusivos",
      "Trilhas de aprendizagem",
    ],
    highlighted: true,
    cta: "Começar Grátis por 14 dias",
  },
  {
    name: "Corporativo",
    price: "Sob consulta",
    description: "Para empresas que investem no desenvolvimento do time.",
    features: [
      "Tudo do plano Profissional",
      "Painel de gestão de equipes",
      "Relatórios de progresso",
      "Cursos personalizados",
      "Onboarding dedicado",
      "SLA de suporte premium",
      "API de integração",
    ],
    highlighted: false,
    cta: "Falar com Consultor",
  },
];

const PricingPlans = () => (
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
          acesso imediato e garantia de 30 dias.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
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
                <div className="flex items-baseline gap-1">
                  <span className="text-sm">R$</span>
                  <span className="text-4xl font-bold font-display">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                  >
                    /mês
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold font-display">
                  {plan.price}
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check
                    size={16}
                    className={`mt-0.5 shrink-0 ${plan.highlighted ? "text-accent" : "text-accent"}`}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full font-semibold ${
                plan.highlighted
                  ? "bg-accent text-accent-foreground hover:bg-gold-dark"
                  : "bg-primary text-primary-foreground hover:bg-navy-light"
              }`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingPlans;
