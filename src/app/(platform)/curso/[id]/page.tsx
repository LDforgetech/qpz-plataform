"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useCourse } from "@/hooks/useCourses";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { Course, CourseModule, CourseLesson } from "@/types/course";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";

/* ─────────────────────────── helpers ─────────────────────────── */

/** Formata segundos totais em uma string legível ("2h 30min", "45min", etc.) */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

/** Conta totais agregados do curso a partir dos módulos */
function useCourseStats(course: Course | undefined) {
  return useMemo(() => {
    if (!course)
      return { totalModules: 0, totalLessons: 0, totalDuration: "—" };

    const totalModules = course.modules.length;
    const totalLessons = course.modules.reduce(
      (acc, mod) => acc + mod.lessons.length,
      0,
    );
    const totalDuration = formatDuration(course.duration_seconds);

    return { totalModules, totalLessons, totalDuration };
  }, [course]);
}

/* ──────────────────────── Skeleton loader ─────────────────────── */

function CourseSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-primary via-primary to-navy-dark text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="h-4 w-48 bg-primary-foreground/10 rounded mb-8" />
          <div className="grid lg:grid-cols-3 gap-10 pb-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 w-3/4 bg-primary-foreground/10 rounded" />
              <div className="h-5 w-full bg-primary-foreground/10 rounded" />
              <div className="h-5 w-2/3 bg-primary-foreground/10 rounded" />
              <div className="flex gap-6 pt-6 border-t border-primary-foreground/10">
                <div className="h-4 w-28 bg-primary-foreground/10 rounded" />
                <div className="h-4 w-24 bg-primary-foreground/10 rounded" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl overflow-hidden border border-border">
                <div className="h-44 bg-secondary" />
                <div className="p-6 space-y-4">
                  <div className="h-10 w-full bg-secondary rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-card border border-border rounded-xl"
            />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="h-48 bg-card border border-border rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Error state ─────────────────────────── */

function CourseError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Erro ao carregar o curso
        </h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft size={16} />
            Voltar para o dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────── Componente de Módulo ───────────────────── */

function ModuleLessonRow({ lesson }: { lesson: CourseLesson }) {
  const duration =
    lesson.duration_formatted ?? formatDuration(lesson.duration_seconds);

  return (
    <li className="flex items-center gap-3 py-3 hover:text-accent cursor-pointer transition-colors">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <Play size={13} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-1">{lesson.title}</p>
      </div>
      {duration && (
        <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
          <Clock size={11} />
          {duration}
        </span>
      )}
    </li>
  );
}

function ModuleAccordionItem({
  module,
  index,
}: {
  module: CourseModule;
  index: number;
}) {
  const moduleDuration = formatDuration(module.total_duration_seconds);
  // console.log(module.total_duration_seconds);
  return (
    <AccordionItem
      value={`module-${module.id}`}
      className="border-b border-border last:border-b-0"
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/50">
        <div className="flex items-center gap-4 flex-1 text-left">
          <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground">
              {module.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {module.lessons.length}{" "}
              {module.lessons.length === 1 ? "aula" : "aulas"}
              {moduleDuration !== "—" && ` • ${moduleDuration}`}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pb-2 pt-0">
        <ul className="divide-y divide-border">
          {module.lessons.map((lesson) => (
            <ModuleLessonRow key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

/* ───────────────────── Página principal ───────────────────────── */

const CourseDetail = () => {
  const { id } = useParams();
  const { data: course, isLoading, isError, error } = useCourse(id);
  const { totalModules, totalLessons, totalDuration } = useCourseStats(course);
  const [openModule, setOpenModule] = useState<string | undefined>(undefined);
  const { data: profileData } = useProfile();

  // Loading state com skeleton
  if (isLoading) return <CourseSkeleton />;

  // Error state
  if (isError) {
    return (
      <CourseError
        message={
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do curso."
        }
      />
    );
  }

  // Sem dados
  if (!course) {
    return <CourseError message="Curso não encontrado." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ──────────────── Hero ──────────────── */}
      <div className="bg-gradient-to-br from-primary via-primary to-navy-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />

        {/* Cover image background */}
        {course.cover_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={course.cover_url}
              fill
              alt={course.title}
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary/60" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 relative z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para o dashboard
          </Link>

          <div className="grid lg:grid-cols-3 mt-6 gap-10 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
                {course.title}
              </h1>
              <p className="text-base md:text-lg opacity-80 max-w-2xl mb-6">
                {course.description}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-primary-foreground/10 pt-6">
                <div className="flex items-center gap-2 opacity-90">
                  <Clock size={16} />
                  {totalDuration} de conteúdo
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <BookOpen size={16} />
                  {totalLessons} {totalLessons === 1 ? "aula" : "aulas"}
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <BookOpen size={16} />
                  {totalModules} {totalModules === 1 ? "módulo" : "módulos"}
                </div>
              </div>
            </motion.div>

            {/* Intro video card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-2xl border border-border">
                {course.intro_video_url ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-black">
                    <iframe
                      src={course.intro_video_url}
                      title={`Vídeo introdutório — ${course.title}`}
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative h-44 bg-gradient-to-br from-primary to-navy-light flex items-center justify-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-[var(--shadow-gold)]">
                      <Play
                        size={24}
                        className="text-accent-foreground ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-5">
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-foreground">
                        Seu progresso
                      </span>
                      <span className="text-accent font-semibold">
                        {course.progress.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={course.progress.percentage}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {course.progress.completed_lessons} de{" "}
                      {course.progress.percentage} aulas concluídas
                    </p>
                  </div>

                  <Link href={`/curso/${id}/aulas`}>
                    <Button
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-[var(--shadow-gold)]"
                    >
                      <Play size={18} fill="currentColor" />
                      Iniciar curso
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ──────────────── Content ──────────────── */}
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
                  {totalModules} {totalModules === 1 ? "módulo" : "módulos"} •{" "}
                  {totalLessons} {totalLessons === 1 ? "aula" : "aulas"} •{" "}
                  {totalDuration}
                </p>
              </div>
            </div>

            {course.modules.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                defaultValue={`module-${course.modules[0].id}`}
                value={openModule}
                onValueChange={setOpenModule}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {course.modules.map((module, idx) => (
                  <ModuleAccordionItem
                    key={module.id}
                    module={module}
                    index={idx}
                  />
                ))}
              </Accordion>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <BookOpen
                  size={32}
                  className="text-muted-foreground mx-auto mb-3 opacity-50"
                />
                <p className="text-muted-foreground">
                  Nenhum módulo cadastrado neste curso ainda.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Detalhes do curso */}
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
                  {totalDuration}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen size={14} /> Aulas
                </span>
                <span className="font-semibold text-foreground">
                  {totalLessons}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen size={14} /> Módulos
                </span>
                <span className="font-semibold text-foreground">
                  {totalModules}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Award size={14} /> Certificado
                </span>
                <span className="font-semibold text-foreground">Sim</span>
              </li>
            </ul>
          </div>

          {/* CTA trilha */}
          {!profileData && (
            <div className="bg-gradient-to-br from-primary to-navy-dark text-primary-foreground rounded-xl p-6">
              <Sparkles size={20} className="text-accent mb-3" />
              <h3 className="font-display font-semibold mb-2">
                Não sabe por onde começar?
              </h3>
              <p className="text-sm opacity-80 mb-4">
                Faça o diagnóstico e receba uma trilha personalizada com cursos
                como este.
              </p>
              <Link href="/minha-trilha">
                <Button
                  size="sm"
                  className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold"
                >
                  Iniciar diagnóstico
                </Button>
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
