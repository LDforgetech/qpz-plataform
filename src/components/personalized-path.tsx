"use client";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  Target,
  Brain,
  ArrowRight,
  Route,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Brain,
    title: "Diagnóstico inteligente",
    description:
      "Um formulário guiado analisa seu momento de carreira, objetivos e maturidade em RH.",
  },
  {
    icon: Route,
    title: "Trilha sob medida",
    description:
      "Geramos uma sequência ideal de cursos — sem você perder tempo escolhendo por onde começar.",
  },
  {
    icon: Target,
    title: "Foco no resultado",
    description:
      "Você estuda só o que realmente vai impactar sua função e suas metas profissionais.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Responda o questionário",
    description:
      "Perguntas rápidas sobre seu cargo, objetivos e disponibilidade.",
  },
  {
    icon: Sparkles,
    title: "Receba seu perfil",
    description:
      "Identificamos se você é Líder, Especialista ou Iniciante em RH.",
  },
  {
    icon: BookOpen,
    title: "Estude sua trilha",
    description: "Sequência personalizada de cursos liberada.",
  },
];

const PersonalizedPath = () => {
  return (
    <section
      id="trilha"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-secondary/40 to-background"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent-foreground/90 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
            <Sparkles size={14} className="text-accent" />
            Exclusivo para alunos
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Sua trilha de cursos,{" "}
            <span className="text-accent">moldada ao seu perfil</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Ao adquirir qualquer plano, você desbloqueia nosso diagnóstico
            inteligente que traça seu perfil profissional e gera uma jornada de
            cursos personalizada — do básico ao estratégico.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
          {/* Coluna esquerda - benefícios */}
          <div className="flex flex-col justify-center space-y-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <b.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* <div className="flex items-center gap-3 pl-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
                  <UserCircle2 size={16} />
                </div>
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center border-2 border-background">
                  <ClipboardList size={16} />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
                  <BookOpen size={16} />
                </div>
              </div>
              <span>
                Mais de 8.000 trilhas geradas para profissionais de RH
              </span>
            </div> */}
          </div>

          {/* Coluna direita - card de venda com lock */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/20 blur-2xl opacity-50 rounded-3xl" />
            <div className="relative bg-card border border-border rounded-2xl shadow-[var(--shadow-card-hover)] overflow-hidden">
              <div className="bg-primary text-primary-foreground p-6">
                <div className="flex items-center gap-3 mb-1">
                  <Compass size={20} className="text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Como funciona
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold">
                  Trilha personalizada em 3 passos
                </h3>
              </div>

              <div className="p-6 space-y-5">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 relative">
                      <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center">
                        <s.icon size={20} className="text-accent" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="absolute left-1/2 top-11 w-px h-6 bg-border -translate-x-1/2" />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          PASSO {i + 1}
                        </span>
                      </div>
                      <h4 className="font-display font-semibold text-foreground mt-0.5">
                        {s.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <div className="mt-6 pt-5 border-t border-border">
                  {/* <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/60 border border-border mb-4">
                    <Lock size={18} className="text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">
                        Recurso exclusivo para alunos.
                      </span>{" "}
                      Adquira qualquer plano para liberar seu diagnóstico e
                      trilha personalizada.
                    </p>
                  </div> */}

                  <Button
                    // asChild
                    className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold"
                  >
                    <a href="#planos" className="flex items-center gap-2">
                      Ver planos e desbloquear
                      <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedPath;
