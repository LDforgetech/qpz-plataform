"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
  Volume2,
  Maximize,
  Minimize,
  Settings,
  List,
  Monitor,
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
import type { Course, CourseLesson } from "@/types/course";

/* ─────────────────────────── helpers ─────────────────────────── */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return `${seconds}s`;
}

type FlatLesson = {
  moduleIdx: number;
  lessonIdx: number;
  moduleTitle: string;
  lesson: CourseLesson;
};

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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-background animate-pulse">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 md:px-6 py-4 border-b border-border flex items-center gap-3">
          <div className="h-4 w-40 bg-secondary rounded" />
          <div className="flex-1" />
          <div className="h-8 w-28 bg-secondary rounded" />
        </div>
        <div className="px-4 md:px-8 pt-6 max-w-4xl w-full mx-auto">
          <div className="bg-black aspect-video w-full rounded-lg flex items-center justify-center">
            <Loader2
              size={40}
              className="text-muted-foreground/30 animate-spin"
            />
          </div>
        </div>
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
function PlayerError({
  message,
  courseId,
}: {
  message: string;
  courseId?: string;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
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

/* ──── Video Player ──── */
const VideoPlayer = ({ current }: { current: FlatLesson }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-black/50 aspect-video w-full relative group rounded-lg overflow-hidden">
      {/* Aqui assumimos que bunny_video_url virá da API da forma que configuramos anteriormente */}
      {(current.lesson as any).bunny_video_url ||
      (current.lesson as any).video_url ? (
        <iframe
          src={
            (current.lesson as any).bunny_video_url ||
            (current.lesson as any).video_url
          }
          title={current.lesson.title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black to-navy-dark flex items-center justify-center">
            <button
              onClick={() => setPlaying((v) => !v)}
              className="w-20 h-20 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform shadow-[var(--shadow-gold)]"
            >
              {playing ? (
                <Pause
                  size={28}
                  className="text-accent-foreground"
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={28}
                  className="text-accent-foreground ml-1"
                  fill="currentColor"
                />
              )}
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
              <div className="h-full w-1/3 bg-accent rounded-full" />
            </div>
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <Play size={16} fill="currentColor" />
                <Volume2 size={16} />
                <span>
                  00:00 /{" "}
                  {(current.lesson as any).duration_formatted ??
                    formatDuration(
                      (current.lesson as any).duration_seconds ?? 0,
                    )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Settings size={16} />
                <Maximize size={16} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ──── Lesson Info ──── */
const LessonInfo = ({
  current,
  moduleIdx,
  flatIdx,
  flatLessons,
  goTo,
}: {
  current: FlatLesson;
  moduleIdx: number;
  flatIdx: number;
  flatLessons: FlatLesson[];
  goTo: (mIdx: number, lIdx: number) => void;
}) => {
  const prev = flatIdx > 0 ? flatLessons[flatIdx - 1] : null;
  const next =
    flatIdx >= 0 && flatIdx < flatLessons.length - 1
      ? flatLessons[flatIdx + 1]
      : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3 w-full">
        <Badge variant="outline" className="text-xs">
          Módulo {moduleIdx + 1} • {current.moduleTitle}
        </Badge>
        <Badge className="bg-secondary text-secondary-foreground capitalize text-xs">
          Vídeo
        </Badge>
        <span className="text-xs text-muted-foreground">
          {(current.lesson as any).duration_formatted ??
            formatDuration((current.lesson as any).duration_seconds ?? 0)}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
        {current.lesson.title}
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Nesta aula você vai aprofundar os conceitos centrais do tema, com
        exemplos práticos e exercícios que reforçam o aprendizado. Acompanhe o
        material de apoio na aba lateral.
      </p>

      <div className="flex items-center justify-between gap-3 pt-6 border-t border-border flex-wrap">
        <Button
          variant="outline"
          disabled={!prev}
          onClick={() => prev && goTo(prev.moduleIdx, prev.lessonIdx)}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Aula anterior</span>
          <span className="sm:hidden">Anterior</span>
        </Button>

        {/* <Button
          variant="ghost"
          size="sm"
          className="text-accent hover:text-gold-dark hidden md:inline-flex"
        >
          <CheckCircle2 size={16} />
          Marcar como concluída
        </Button> */}

        <Button
          disabled={!next}
          onClick={() => next && goTo(next.moduleIdx, next.lessonIdx)}
          className="bg-accent text-accent-foreground hover:bg-gold-dark"
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
  );
};

/* ──── Sidebar de aulas ──── */
const SidebarList = ({
  onPick,
  course,
  moduleIdx,
  lessonIdx,
  totalLessons,
  goTo,
}: {
  onPick?: () => void;
  goTo: (mIdx: number, lIdx: number) => void;
  course: Course;
  moduleIdx: number;
  lessonIdx: number;
  totalLessons: number;
}) => {
  const [openModule, setOpenModule] = useState<string | undefined>(
    `module-${moduleIdx}`,
  );

  // Progresso (placeholder)
  const completedLessons = 0;
  const courseProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col h-full w-full">
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
                      {formatDuration((mod as any).total_duration_seconds ?? 0)}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <ul>
                    {mod.lessons.map((lesson, lIdx) => {
                      const isActive = mIdx === moduleIdx && lIdx === lessonIdx;
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
                                {(lesson as any).duration_formatted ??
                                  formatDuration(
                                    (lesson as any).duration_seconds ?? 0,
                                  )}
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
};

/* ───────────────────── Componente principal ───────────────────── */
export default function LessonPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = Array.isArray(id) ? id[0] : id;

  const moduleIdx = Number(searchParams.get("modulo") ?? 0);
  const lessonIdx = Number(searchParams.get("aula") ?? 0);

  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const flatLessons = useFlatLessons(course);

  const flatIdx = useMemo(() => {
    return flatLessons.findIndex(
      (fl) => fl.moduleIdx === moduleIdx && fl.lessonIdx === lessonIdx,
    );
  }, [flatLessons, moduleIdx, lessonIdx]);

  const current = flatLessons[flatIdx >= 0 ? flatIdx : 0];
  const [theaterMode, setTheaterMode] = useState(false);

  const goTo = useCallback(
    (mIdx: number, lIdx: number) => {
      router.push(`/curso/${courseId}/aulas?modulo=${mIdx}&aula=${lIdx}`);
    },
    [router, courseId],
  );

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
    return <PlayerError message="Aula não encontrada." courseId={courseId} />;
  }

  /* ──── Header ──── */
  const Header = (
    <div className="px-4 md:px-6 py-4 border-b border-border flex items-center gap-3 ">
      <Link
        href={`/curso/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Visão geral do curso</span>
      </Link>
      <div className="flex-1" />
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
          <SidebarList
            course={course}
            moduleIdx={moduleIdx}
            lessonIdx={lessonIdx}
            totalLessons={flatLessons.length}
            goTo={goTo}
          />
        </SheetContent>
      </Sheet>
      <Button
        variant={theaterMode ? "default" : "outline"}
        size="sm"
        className={cn(
          "hidden lg:inline-flex",
          theaterMode && "bg-accent text-accent-foreground hover:bg-gold-dark",
        )}
        onClick={() => setTheaterMode((v) => !v)}
      >
        {theaterMode ? <Minimize size={16} /> : <Monitor size={16} />}
        {theaterMode ? "Sair do modo teatro" : "Modo teatro"}
      </Button>
    </div>
  );

  /* ──── Render ──── */
  return theaterMode ? (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background ml-12">
      {Header}
      <div className="px-4 md:px-8 pt-6 w-full max-w-[1300px] mx-auto">
        <VideoPlayer current={current} />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1250px] w-full mx-auto">
        <div className="flex-1 px-4 md:px-8 py-6 min-w-0">
          <LessonInfo
            current={current}
            moduleIdx={moduleIdx}
            flatIdx={flatIdx}
            flatLessons={flatLessons}
            goTo={goTo}
          />
        </div>
        <aside className="hidden lg:flex w-[360px] xl:w-[400px] border-l border-border bg-card shrink-0">
          <SidebarList
            course={course}
            moduleIdx={moduleIdx}
            lessonIdx={lessonIdx}
            totalLessons={flatLessons.length}
            goTo={goTo}
          />
        </aside>
      </div>
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-background ml-12">
      <div className="flex-1 flex flex-col min-w-0">
        {Header}
        <div className="px-4 md:px-8 pt-6 w-full max-w-4xl mx-auto">
          <VideoPlayer current={current} />
        </div>
        <div className="flex-1 px-4 md:px-8 py-6 max-w-4xl w-full mx-auto">
          <LessonInfo
            current={current}
            moduleIdx={moduleIdx}
            flatIdx={flatIdx}
            flatLessons={flatLessons}
            goTo={goTo}
          />
        </div>
      </div>
      <aside className="hidden lg:flex w-[360px] xl:w-[400px] border-l border-border bg-card shrink-0">
        <SidebarList
          course={course}
          moduleIdx={moduleIdx}
          lessonIdx={lessonIdx}
          totalLessons={flatLessons.length}
          goTo={goTo}
        />
      </aside>
    </div>
  );
}
