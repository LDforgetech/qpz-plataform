"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  Users,
  Star,
  Award,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  Bookmark,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

type Lesson = {
  title: string;
  duration: string;
  type: "video" | "quiz" | "material";
  completed?: boolean;
  locked?: boolean;
};

type Module = {
  title: string;
  duration: string;
  lessons: Lesson[];
};

const courseData = {
  title: "Gestão Estratégica de Pessoas",
  category: "Liderança",
  level: "Intermediário",
  description:
    "Um programa completo para profissionais de RH que desejam atuar de forma estratégica dentro das organizações. Aprenda a alinhar a gestão de pessoas aos objetivos de negócio, construir indicadores significativos e influenciar a alta liderança com dados e visão sistêmica.",
  shortDescription:
    "Posicione o RH como parceiro estratégico do negócio com frameworks modernos e práticos.",
  instructor: {
    name: "Ana Beatriz Coutinho",
    role: "Head de People & Culture • 18 anos de experiência",
    initials: "AC",
  },
  stats: {
    totalHours: "24h 30min",
    totalLessons: 48,
    modules: 8,
    students: 3284,
    rating: 4.9,
    reviews: 612,
  },
  progress: 64,
  profileTags: [
    "Líder de RH",
    "Business Partner",
    "Coordenador(a)",
    "Gerente de Pessoas",
    "5+ anos de experiência",
  ],
  whatYouLearn: [
    "Estruturar um RH alinhado à estratégia da empresa",
    "Definir e acompanhar indicadores (KPIs e OKRs) de pessoas",
    "Conduzir conversas difíceis e dar feedback de alta performance",
    "Modelar processos de gestão de carreira e sucessão",
    "Construir um discurso de influência junto à liderança executiva",
    "Aplicar people analytics em decisões do dia a dia",
  ],
  modules: [
    {
      title: "Fundamentos do RH Estratégico",
      duration: "3h 10min",
      lessons: [
        {
          title: "Boas-vindas e como aproveitar o curso",
          duration: "6 min",
          type: "video",
          completed: true,
        },
        {
          title: "RH operacional vs RH estratégico",
          duration: "22 min",
          type: "video",
          completed: true,
        },
        {
          title: "O modelo de Dave Ulrich na prática",
          duration: "28 min",
          type: "video",
          completed: true,
        },
        {
          title: "Quiz — Fundamentos",
          duration: "10 min",
          type: "quiz",
          completed: true,
        },
      ],
    },
    {
      title: "Conectando RH à estratégia de negócio",
      duration: "3h 45min",
      lessons: [
        {
          title: "Lendo o plano estratégico da empresa",
          duration: "24 min",
          type: "video",
          completed: true,
        },
        {
          title: "Construindo a agenda de pessoas",
          duration: "32 min",
          type: "video",
          completed: true,
        },
        {
          title: "Stakeholders e mapa de influência",
          duration: "26 min",
          type: "video",
          completed: true,
        },
        {
          title: "Material — Template de agenda de RH",
          duration: "5 min",
          type: "material",
          completed: true,
        },
      ],
    },
    {
      title: "Indicadores e people analytics",
      duration: "3h 20min",
      lessons: [
        {
          title: "Quais indicadores realmente importam",
          duration: "30 min",
          type: "video",
          completed: true,
        },
        {
          title: "Construindo um dashboard de RH",
          duration: "38 min",
          type: "video",
          completed: false,
        },
        {
          title: "Storytelling com dados de pessoas",
          duration: "26 min",
          type: "video",
          completed: false,
        },
        {
          title: "Quiz — Indicadores",
          duration: "10 min",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      title: "Feedback e conversas de alta performance",
      duration: "3h 05min",
      lessons: [
        {
          title: "Modelo SCI de feedback",
          duration: "24 min",
          type: "video",
          completed: false,
        },
        {
          title: "Conduzindo conversas difíceis",
          duration: "34 min",
          type: "video",
          completed: false,
        },
        {
          title: "Roleplay comentado",
          duration: "28 min",
          type: "video",
          completed: false,
        },
      ],
    },
    {
      title: "Carreira, sucessão e desenvolvimento",
      duration: "2h 50min",
      lessons: [
        {
          title: "Trilhas de carreira modernas",
          duration: "26 min",
          type: "video",
          locked: true,
        },
        {
          title: "Mapa de sucessão 9-box",
          duration: "30 min",
          type: "video",
          locked: true,
        },
        {
          title: "PDIs que realmente funcionam",
          duration: "28 min",
          type: "video",
          locked: true,
        },
      ],
    },
    {
      title: "Cultura, engajamento e clima",
      duration: "2h 40min",
      lessons: [
        {
          title: "Diagnóstico de cultura",
          duration: "28 min",
          type: "video",
          locked: true,
        },
        {
          title: "Plano de ação a partir da pesquisa de clima",
          duration: "32 min",
          type: "video",
          locked: true,
        },
      ],
    },
    {
      title: "Influenciando a alta liderança",
      duration: "2h 30min",
      lessons: [
        {
          title: "Linguagem de negócio para o RH",
          duration: "26 min",
          type: "video",
          locked: true,
        },
        {
          title: "Apresentando para o C-Level",
          duration: "34 min",
          type: "video",
          locked: true,
        },
      ],
    },
    {
      title: "Projeto final e certificação",
      duration: "3h 10min",
      lessons: [
        {
          title: "Briefing do projeto final",
          duration: "18 min",
          type: "video",
          locked: true,
        },
        {
          title: "Mentoria em grupo",
          duration: "60 min",
          type: "video",
          locked: true,
        },
        {
          title: "Avaliação final",
          duration: "30 min",
          type: "quiz",
          locked: true,
        },
      ],
    },
  ] as Module[],
};

const CourseDetail = () => {
  // useParams();
  const [openModule, setOpenModule] = useState<string | undefined>("module-2");

  const completedLessons = courseData.modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary to-navy-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 relative">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para o dashboard
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-accent text-accent-foreground">
                  {courseData.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground"
                >
                  {courseData.level}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
                {courseData.title}
              </h1>
              <p className="text-base md:text-lg opacity-80 max-w-2xl mb-6">
                {courseData.shortDescription}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-primary-foreground/10 pt-6">
                <div className="flex items-center gap-2 opacity-90">
                  <Clock size={16} />
                  {courseData.stats.totalHours} de vídeo
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <BookOpen size={16} />
                  {courseData.stats.totalLessons} aulas
                </div>
              </div>
            </motion.div>

            {/* Player intro video card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-2xl border border-border">
                <div className="relative h-44 bg-gradient-to-br from-primary to-navy-light flex items-center justify-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-[var(--shadow-gold)]">
                    <Play
                      size={24}
                      className="text-accent-foreground ml-1"
                      fill="currentColor"
                    />
                  </div>
                  <span className="absolute bottom-3 left-3 text-xs bg-background/90 text-foreground px-2 py-1 rounded font-medium">
                    Prévia • 2:14
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-foreground">
                        Seu progresso
                      </span>
                      <span className="text-accent font-semibold">
                        {courseData.progress}%
                      </span>
                    </div>
                    <Progress value={courseData.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completedLessons} de {courseData.stats.totalLessons}{" "}
                      aulas concluídas
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-[var(--shadow-gold)]"
                  >
                    <Play size={18} fill="currentColor" />
                    Continuar curso
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Grade de aulas */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Grade de aulas
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {courseData.stats.modules} módulos •{" "}
                  {courseData.stats.totalLessons} aulas •{" "}
                  {courseData.stats.totalHours}
                </p>
              </div>
              <button className="text-sm font-semibold text-accent hover:text-gold-dark hidden sm:block">
                Expandir todos
              </button>
            </div>

            <Accordion
              type="single"
              collapsible
              value={openModule}
              onValueChange={setOpenModule}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {courseData.modules.map((module, idx) => (
                <AccordionItem
                  key={module.title}
                  value={`module-${idx}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground">
                          {module.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {module.lessons.length} aulas • {module.duration}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-2 pt-0">
                    <ul className="divide-y divide-border">
                      {module.lessons.map((lesson) => {
                        const Icon =
                          lesson.type === "quiz"
                            ? Target
                            : lesson.type === "material"
                              ? Download
                              : Play;
                        return (
                          <li
                            key={lesson.title}
                            className={`flex items-center gap-3 py-3 ${
                              lesson.locked
                                ? "opacity-60"
                                : "hover:text-accent cursor-pointer"
                            } transition-colors`}
                          >
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                              {lesson.locked ? (
                                <Lock
                                  size={13}
                                  className="text-muted-foreground"
                                />
                              ) : lesson.completed ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-accent"
                                />
                              ) : (
                                <Icon size={13} className="text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground line-clamp-1">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {lesson.type === "quiz"
                                  ? "Quiz"
                                  : lesson.type === "material"
                                    ? "Material complementar"
                                    : "Aula em vídeo"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                              <Clock size={11} />
                              {lesson.duration}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Perfis ideais */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-accent" />
              <h3 className="font-display font-semibold text-foreground">
                Indicado para
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Este curso aparece em trilhas personalizadas para os seguintes
              perfis:
            </p>
            <div className="flex flex-wrap gap-2">
              {courseData.profileTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-secondary text-foreground hover:bg-secondary font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Detalhes */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Detalhes do curso
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={14} /> Duração total
                </span>
                <span className="font-semibold text-foreground">
                  {courseData.stats.totalHours}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen size={14} /> Aulas
                </span>
                <span className="font-semibold text-foreground">
                  {courseData.stats.totalLessons}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 size={14} /> Nível
                </span>
                <span className="font-semibold text-foreground">
                  {courseData.level}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Award size={14} /> Certificado
                </span>
                <span className="font-semibold text-foreground">Sim</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users size={14} /> Alunos
                </span>
                <span className="font-semibold text-foreground">
                  {courseData.stats.students.toLocaleString("pt-BR")}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA trilha */}
          <div className="bg-gradient-to-br from-primary to-navy-dark text-primary-foreground rounded-xl p-6">
            <Sparkles size={20} className="text-accent mb-3" />
            <h3 className="font-display font-semibold mb-2">
              Não sabe por onde começar?
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Faça o diagnóstico e receba uma trilha personalizada com cursos
              como este.
            </p>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold"
              >
                Iniciar diagnóstico
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
