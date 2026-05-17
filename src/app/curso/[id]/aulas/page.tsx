"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  Target,
  Download,
  PanelRightClose,
  PanelRightOpen,
  List,
  AlertCircle,
  Loader2,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCourse } from "@/hooks/useCourses";
import type { Course, CourseModule, CourseLesson } from "@/types/course";

/* ─────────────────────────── helpers ─────────────────────────── */

/** Formata segundos totais em uma string legível ("2h 30min", "45min", etc.) */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return `${seconds}s`;
}

/** Estrutura plana de uma aula para navegação sequencial */
type FlatLesson = {
  moduleIdx: number;
  lessonIdx: number;
  moduleTitle: string;
  lesson: CourseLesson;
};

/** Gera a lista "flat" de aulas a partir dos módulos do curso */
function useFlatLessons(course: Course | undefined): FlatLesson[] {
  return useMemo(() => {
    if (!course) return [];
    const flat: FlatLesson[] = [];
    course.modules.forEach((mod, mIdx) => {
      mod.lessons.forEach((lesson, lIdx) => {
        flat.push({
          moduleIdx: mIdx,
          lessonIdx: lIdx,
          moduleTitle: mod.title,
          lesson,
        });
      });
    });
    return flat;
  }, [course]);
}

/* ──────────────────────── Skeleton loader ─────────────────────── */

function PlayerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background animate-pulse">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header skeleton */}
        <div className="px-4 md:px-6 py-4 border-b border-border flex items-center gap-3">
          <div className="h-4 w-40 bg-secondary rounded" />
          <div className="flex-1" />
          <div className="h-8 w-28 bg-secondary rounded" />
        </div>
        {/* Video skeleton */}
        <div className="bg-black aspect-video w-full flex items-center justify-center">
          <Loader2 size={40} className="text-muted-foreground/30 animate-spin" />
        </div>
        {/* Info skeleton */}
        <div className="px-4 md:px-8 py-6 max-w-4xl w-full mx-auto space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-32 bg-secondary rounded-full" />
            <div className="h-5 w-16 bg-secondary rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-secondary rounded" />
          <div className="h-4 w-full bg-secondary rounded" />
          <div className="h-4 w-2/3 bg-secondary rounded" />
        </div>
      </div>
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-[360px] border-l border-border bg-card flex-col">
        <div className="px-5 py-4 border-b border-border space-y-3">
          <div className="h-3 w-24 bg-secondary rounded" />
          <div className="h-5 w-48 bg-secondary rounded" />
          <div className="h-1.5 w-full bg-secondary rounded-full" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-secondary rounded-lg" />
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ──────────────────────── Error state ─────────────────────────── */

function PlayerError({ message, courseId }: { message: string; courseId?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Erro ao carregar a aula
        </h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link href={courseId ? `/curso/${courseId}` : "/dashboard"}>
          <Button variant="outline">
            <ArrowLeft size={16} />
            {courseId ? "Voltar para o curso" : "Voltar para o dashboard"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────── Componente principal ───────────────────── */

export default function LessonPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = Array.isArray(id) ? id[0] : id;

  // Índices do módulo e aula vindos da query string
  const moduleIdx = Number(searchParams.get("modulo") ?? 0);
  const lessonIdx = Number(searchParams.get("aula") ?? 0);

  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const flatLessons = useFlatLessons(course);

  // Encontra a posição flat da aula atual
  const flatIdx = useMemo(() => {
    return flatLessons.findIndex(
      (fl) => fl.moduleIdx === moduleIdx && fl.lessonIdx === lessonIdx,
    );
  }, [flatLessons, moduleIdx, lessonIdx]);

  const current = flatLessons[flatIdx >= 0 ? flatIdx : 0];
  const prev = flatIdx > 0 ? flatLessons[flatIdx - 1] : null;
  const next =
    flatIdx >= 0 && flatIdx < flatLessons.length - 1
      ? flatLessons[flatIdx + 1]
      : null;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openModule, setOpenModule] = useState<string | undefined>(
    `module-${moduleIdx}`,
  );

  // Navega para uma aula específica
  const goTo = useCallback(
    (mIdx: number, lIdx: number) => {
      router.push(`/curso/${courseId}/aulas?modulo=${mIdx}&aula=${lIdx}`);
    },
    [router, courseId],
  );

  // Progresso (placeholder — futuramente virá da API)
  const totalLessons = flatLessons.length;
  const completedLessons = 0; // TODO: integrar com endpoint de progresso
  const courseProgress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  /* ──── Estados de carregamento e erro ──── */

  if (isLoading) return <PlayerSkeleton />;

  if (isError) {
    return (
      <PlayerError
        message={
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do curso."
        }
        courseId={courseId}
      />
    );
  }

  if (!course || !current) {
    return (
      <PlayerError message="Aula não encontrada." courseId={courseId} />
    );
  }

  /* ──── Sidebar de aulas (compartilhada desktop + mobile) ──── */

  const SidebarList = ({ onPick }: { onPick?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border shrink-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          Conteúdo do curso
        </p>
        <h3 className="font-display font-bold text-foreground line-clamp-1">
          {course.title}
        </h3>
        <div className="flex items-center justify-between text-xs mt-3 mb-1.5">
          <span className="text-muted-foreground">
            {completedLessons}/{totalLessons} aulas
          </span>
          <span className="font-semibold text-accent">{courseProgress}%</span>
        </div>
        <Progress value={courseProgress} className="h-1.5" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          value={openModule}
          onValueChange={setOpenModule}
        >
          {course.modules.map((mod, mIdx) => {
            const moduleCompleted = 0; // TODO: integrar com progresso real
            return (
              <AccordionItem
                key={mod.id}
                value={`module-${mIdx}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 text-left">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Módulo {String(mIdx + 1).padStart(2, "0")}
                    </p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {mod.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {moduleCompleted}/{mod.lessons.length} •{" "}
                      {formatDuration(mod.total_duration_seconds)}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ul>
                    {mod.lessons.map((lesson, lIdx) => {
                      const isActive =
                        mIdx === moduleIdx && lIdx === lessonIdx;
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => {
                              goTo(mIdx, lIdx);
                              onPick?.();
                            }}
                            className={cn(
                              "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-l-2",
                              isActive
                                ? "bg-accent/10 border-l-accent"
                                : "border-l-transparent hover:bg-secondary/60",
                            )}
                          >
                            <div
                              className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                isActive
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-secondary",
                              )}
                            >
                              {/* TODO: integrar status de conclusão */}
                              <Play
                                size={12}
                                className={
                                  isActive
                                    ? "text-accent-foreground"
                                    : "text-primary"
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm line-clamp-2",
                                  isActive
                                    ? "font-semibold text-foreground"
                                    : "text-foreground/90",
                                )}
                              >
                                {lesson.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {lesson.duration_formatted ??
                                  formatDuration(lesson.duration_seconds)}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );

  /* ──── Render ──── */

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Main player area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-border flex items-center gap-3">
          <Link
            href={`/curso/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Visão geral do curso</span>
          </Link>
          <div className="flex-1" />

          {/* Mobile lesson list trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <List size={16} />
                Aulas
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[320px] sm:w-[380px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Conteúdo do curso</SheetTitle>
              </SheetHeader>
              <SidebarList />
            </SheetContent>
          </Sheet>

          {/* Desktop sidebar toggle */}
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? (
              <PanelRightClose size={16} />
            ) : (
              <PanelRightOpen size={16} />
            )}
            {sidebarOpen ? "Ocultar aulas" : "Mostrar aulas"}
          </Button>
        </div>

        {/* Video player */}
        <div className="bg-black aspect-video w-full relative group">
          {current.lesson.bunny_video_url ? (
            <iframe
              src={current.lesson.bunny_video_url}
              title={current.lesson.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: "none" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black to-navy-dark flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <Play
                    size={28}
                    className="text-accent ml-1"
                    fill="currentColor"
                  />
                </div>
                <p className="text-white/60 text-sm">
                  Vídeo ainda não disponível
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson info + nav */}
        <div className="flex-1 px-4 md:px-8 py-6 max-w-4xl w-full mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              Módulo {moduleIdx + 1} • {current.moduleTitle}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground capitalize text-xs">
              Vídeo
            </Badge>
            <span className="text-xs text-muted-foreground">
              {current.lesson.duration_formatted ??
                formatDuration(current.lesson.duration_seconds)}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            {current.lesson.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Nesta aula você vai aprofundar os conceitos centrais do tema, com
            exemplos práticos e exercícios que reforçam o aprendizado.
            Acompanhe o material de apoio na aba lateral.
          </p>

          <div className="flex items-center justify-between gap-3 pt-6 border-t border-border">
            <Button
              variant="outline"
              disabled={!prev}
              onClick={() =>
                prev && goTo(prev.moduleIdx, prev.lessonIdx)
              }
              className="flex-1 sm:flex-none"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Aula anterior</span>
              <span className="sm:hidden">Anterior</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-accent hover:text-gold-dark hidden md:inline-flex"
            >
              <CheckCircle2 size={16} />
              Marcar como concluída
            </Button>

            <Button
              disabled={!next}
              onClick={() =>
                next && goTo(next.moduleIdx, next.lessonIdx)
              }
              className="flex-1 sm:flex-none bg-accent text-accent-foreground hover:bg-gold-dark"
            >
              <span className="hidden sm:inline">Próxima aula</span>
              <span className="sm:hidden">Próxima</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          {next && (
            <div className="mt-4 text-xs text-muted-foreground text-right">
              A seguir:{" "}
              <span className="text-foreground font-medium">
                {next.lesson.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar (right) */}
      {sidebarOpen && (
        <aside className="hidden lg:flex w-[360px] xl:w-[400px] border-l border-border bg-card shrink-0">
          <SidebarList />
        </aside>
      )}
    </div>
  );
}
