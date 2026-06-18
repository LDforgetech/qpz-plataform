"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchAutocomplete } from "@/hooks/useSearch";
import type { SearchTrailResult, SearchCourseResult } from "@/types/search";

// ── Hook de Debounce ────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ── Flat item type para navegação por teclado ───────────────────────
type FlatItem =
  | { kind: "trail"; href: string; item: SearchTrailResult }
  | { kind: "course"; href: string; item: SearchCourseResult };

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isFetching } = useSearchAutocomplete(
    debouncedQuery,
    open,
  );

  const safeResults = results ?? { trails: [], courses: [], total: 0 };

  const flatItems = useMemo<FlatItem[]>(
    () => [
      ...safeResults.trails.map((t) => ({
        kind: "trail" as const,
        href: `/trilha/${t.id}`,
        item: t,
      })),
      ...safeResults.courses.map((c) => ({
        kind: "course" as const,
        href: `/curso/${c.id}`,
        item: c,
      })),
    ],
    [safeResults.trails, safeResults.courses],
  );

  // Reset index quando a query muda
  useEffect(() => {
    setActiveIdx(-1);
  }, [query]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToResults = () => {
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && flatItems[activeIdx]) {
        setOpen(false);
        router.push(flatItems[activeIdx].href);
      } else {
        goToResults();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;
  const hasResults =
    safeResults.trails.length > 0 || safeResults.courses.length > 0;
  let runningIdx = -1;

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar cursos, módulos, temas..."
        className="pl-10 bg-secondary border-0"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95">
          {/* Loading */}
          {isFetching && debouncedQuery.length >= 2 ? (
            <div className="px-4 py-6 flex items-center justify-center text-muted-foreground gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Buscando...</span>
            </div>
          ) : (
            <>
              {/* Sem resultados */}
              {!hasResults && debouncedQuery.length >= 2 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nenhum resultado para{" "}
                  <span className="font-semibold text-foreground">
                    &ldquo;{debouncedQuery}&rdquo;
                  </span>
                </div>
              )}

              {/* Mínimo de caracteres */}
              {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Digite pelo menos 2 caracteres para buscar...
                </div>
              )}

              {/* Trilhas */}
              {safeResults.trails.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Trilhas
                  </div>
                  {safeResults.trails.map((t) => {
                    runningIdx++;
                    const idx = runningIdx;
                    return (
                      <Link
                        key={t.id}
                        href={`/trilha/${t.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-start gap-3 px-4 py-2.5 hover:bg-secondary transition-colors",
                          activeIdx === idx && "bg-secondary",
                        )}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {t.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {t.totalCourses} cursos • {t.totalHours}h • {t.tag}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Cursos */}
              {safeResults.courses.length > 0 && (
                <div className="py-2 border-t border-border">
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Cursos
                  </div>
                  {safeResults.courses.map((c) => {
                    runningIdx++;
                    const idx = runningIdx;
                    return (
                      <Link
                        key={c.id}
                        href={`/curso/${c.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-start gap-3 px-4 py-2.5 hover:bg-secondary transition-colors",
                          activeIdx === idx && "bg-secondary",
                        )}
                      >
                        <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          <BookOpen size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {c.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.category} • {c.hours}h • {c.level}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Ver todos */}
              {safeResults.total > flatItems.length && (
                <button
                  type="button"
                  onClick={goToResults}
                  className="w-full flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/40 hover:bg-secondary transition-colors text-sm font-semibold text-primary"
                >
                  <span>
                    Ver todos os {safeResults.total} resultados para &ldquo;
                    {debouncedQuery}&rdquo;
                  </span>
                  <ArrowRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
