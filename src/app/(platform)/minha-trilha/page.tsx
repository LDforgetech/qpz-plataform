"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  TrendingUp,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import DiagnosticForm from "@/components/diagnostic-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

// ── Cores e descrições por grupo ────────────────────────────────────
type GroupStyle = {
  gradient: string;
  accent: string;
  description: string;
};

const groupColors: Record<string, GroupStyle> = {
  Temperamentos: {
    gradient: "from-blue-500/15 to-blue-500/5",
    accent: "text-blue-500",
    description:
      "Revela como você reage emocionalmente e se relaciona com o ambiente.",
  },
  Arquétipos: {
    gradient: "from-amber-500/15 to-amber-500/5",
    accent: "text-amber-500",
    description: "Identifica o padrão de comportamento que guia suas decisões.",
  },
  "Sist. Representacional": {
    gradient: "from-emerald-500/15 to-emerald-500/5",
    accent: "text-emerald-500",
    description:
      "Mostra qual canal sensorial você usa predominantemente para aprender.",
  },
  "Linguagem de Conexão": {
    gradient: "from-rose-500/15 to-rose-500/5",
    accent: "text-rose-500",
    description:
      "Indica como você cria e valoriza vínculos com outras pessoas.",
  },
};

const defaultGroupStyle: GroupStyle = {
  gradient: "from-primary/15 to-primary/5",
  accent: "text-primary",
  description: "",
};

// ── Componente ──────────────────────────────────────────────────────
const MyTrail = () => {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const { data: profileData, isLoading, refetch } = useProfile();

  // ====== Loading ======
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  // ====== Estado vazio: usuário ainda não respondeu ======
  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-primary to-navy-dark rounded-2xl p-8 md:p-12 text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-5">
              <Sparkles size={26} />
            </div>
            <Badge className="bg-accent text-accent-foreground mb-3">
              Trilha personalizada
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Você ainda não traçou seu perfil
            </h1>
            <p className="opacity-80 max-w-2xl mb-6">
              Para receber uma trilha sob medida, com cursos selecionados para o
              seu momento de carreira, é necessário responder ao diagnóstico de
              perfil. Leva poucos minutos.
            </p>
            <Button
              size="lg"
              onClick={() => setDiagnosticOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-[var(--shadow-gold)]"
            >
              <Sparkles size={18} />
              Iniciar diagnóstico
            </Button>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: Target,
              title: "Mapeia seu perfil",
              text: "Identificamos seu temperamento, arquétipo e linguagem.",
            },
            {
              icon: TrendingUp,
              title: "Mostra seus gaps",
              text: "Descobre áreas com baixa pontuação para desenvolver.",
            },
            {
              icon: BookOpen,
              title: "Gera sua trilha",
              text: "Cursos selecionados para acelerar seu próximo passo.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
                  <Icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{b.text}</p>
              </div>
            );
          })}
        </div>

        <DiagnosticForm
          open={diagnosticOpen}
          onOpenChange={(open) => {
            setDiagnosticOpen(open);
            if (!open) refetch();
          }}
        />
      </div>
    );
  }

  // ====== Perfil já traçado ======
  const { profile, gaps, recommended_path } = profileData;
  const groups = Object.keys(profile);

  // Pega o "predominante" de cada grupo
  const dominantByGroup = groups.map((g) => {
    const entries = Object.entries(profile[g]);
    const top = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    return { group: g, type: top[0], score: top[1] };
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-primary to-navy-dark rounded-2xl p-8 text-primary-foreground relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Badge className="bg-accent text-accent-foreground mb-3">
              <Sparkles size={12} className="mr-1" /> Seu perfil
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Sua trilha personalizada está pronta
            </h1>
            <p className="opacity-80 max-w-2xl">
              Veja a leitura do seu perfil, os pontos de desenvolvimento e os
              cursos recomendados para acelerar sua evolução.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setDiagnosticOpen(true)}
            className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border border-primary-foreground/20 shrink-0"
          >
            <RefreshCw size={14} />
            Refazer diagnóstico
          </Button>
        </div>

        {/* Destaques predominantes */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {dominantByGroup.map((d) => (
            <div
              key={d.group}
              className="bg-primary-foreground/10 border border-primary-foreground/15 rounded-xl p-4 backdrop-blur-sm"
            >
              <p className="text-[11px] uppercase tracking-wider opacity-70">
                {d.group}
              </p>
              <p className="font-display text-lg font-bold mt-1">{d.type}</p>
              <p className="text-xs opacity-80 mt-0.5">
                {d.score.toFixed(0)}% de predominância
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Perfil detalhado por grupo */}
      <section className="mb-10">
        <h2 className="text-xl font-display font-bold text-foreground mb-1">
          Leitura completa do seu perfil
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Cada categoria reflete uma dimensão diferente da sua forma de ser e
          trabalhar.
        </p>

        <div className="grid lg:grid-cols-2 gap-5">
          {groups.map((g, i) => {
            const entries = Object.entries(profile[g]).sort(
              (a, b) => b[1] - a[1],
            );
            const color = groupColors[g] ?? defaultGroupStyle;
            return (
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${color.gradient} mb-3`}
                >
                  <Sparkles size={12} className={color.accent} />
                  <span className="text-xs font-semibold text-foreground">
                    {g}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {color.description}
                </p>

                <div className="space-y-3">
                  {entries.map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium text-foreground">
                          {key}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {value.toFixed(value % 1 === 0 ? 0 : 2)}%
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Gaps */}
      {/* <section className="mb-10">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <AlertCircle size={18} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Pontos de desenvolvimento
            </h2>
            <p className="text-sm text-muted-foreground">
              Áreas com menor pontuação que sua trilha foi desenhada para
              fortalecer.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {groups.map((g) => {
            const groupGaps = gaps.filter((gp) => gp.group === g);
            if (!groupGaps.length) return null;
            return (
              <div key={g} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {g}
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupGaps.map((gp) => (
                    <Badge
                      key={gp.type}
                      variant="secondary"
                      className="text-xs py-1.5 px-3"
                    >
                      {gp.type}
                      <span className="ml-2 text-muted-foreground tabular-nums">
                        {gp.score.toFixed(0)}%
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section> */}

      {/* Trilha recomendada */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Sua trilha recomendada
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Cursos na ordem ideal para suprir seus pontos de desenvolvimento.
            </p>
          </div>
          <Badge className="bg-accent text-accent-foreground">
            {recommended_path.length} cursos
          </Badge>
        </div>

        <div className="space-y-4">
          {recommended_path
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/curso/${course.id}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all flex flex-col md:flex-row"
                >
                  <div className="relative md:w-64 h-44 md:h-auto shrink-0 bg-gradient-to-br from-primary to-navy-light overflow-hidden">
                    {course.cover_url && (
                      <Image
                        width={256}
                        height={176}
                        src={course.cover_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-accent text-accent-foreground font-display font-bold flex items-center justify-center text-sm shadow-lg">
                      {course.order}
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Etapa {course.order}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-4">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                        Trabalha seus gaps de
                      </p>
                      {/* <div className="flex flex-wrap gap-1.5">
                        {course.addresses_gaps.map((gap) => (
                          <Badge
                            key={gap}
                            variant="secondary"
                            className="text-[11px]"
                          >
                            {gap}
                          </Badge>
                        ))}
                      </div> */}
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                        Ver curso <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </section>

      <DiagnosticForm
        open={diagnosticOpen}
        onOpenChange={(open) => {
          setDiagnosticOpen(open);
          if (!open) refetch();
        }}
      />
    </div>
  );
};

export default MyTrail;
