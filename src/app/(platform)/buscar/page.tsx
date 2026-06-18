"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useSearchResults } from "@/hooks/useSearch";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data: results, isLoading, isError } = useSearchResults(query);
  const safeResults = results ?? { trails: [], courses: [], total: 0 };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Search size={14} />
          <span>Resultados da busca</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          {query ? (
            <>Resultados para &ldquo;{query}&rdquo;</>
          ) : (
            "Faça uma busca"
          )}
        </h1>
        {query && !isLoading && (
          <p className="text-sm text-muted-foreground mt-1">
            {safeResults.total}{" "}
            {safeResults.total === 1
              ? "resultado encontrado"
              : "resultados encontrados"}
          </p>
        )}
      </div>

      {/* Loading */}
      {isLoading && query && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Erro */}
      {isError && (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-muted-foreground">
            Ocorreu um erro ao buscar. Tente novamente mais tarde.
          </p>
        </div>
      )}

      {/* Sem resultados */}
      {!isLoading && !isError && query && safeResults.total === 0 && (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-muted-foreground">
            Não encontramos nada para{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{query}&rdquo;
            </span>
            .
          </p>
        </div>
      )}

      {/* Trilhas */}
      {safeResults.trails.length > 0 && (
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            Trilhas ({safeResults.trails.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {safeResults.trails.map((t) => (
              <Link
                key={t.id}
                href={`/trilha/${t.id}`}
                className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all block"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {t.tag}
                  </Badge>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {t.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.totalCourses} cursos • {t.totalHours}h
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* Cursos */}
      {safeResults.courses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            Cursos ({safeResults.courses.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeResults.courses.map((c) => (
              <Link
                key={c.id}
                href={`/curso/${c.id}`}
                className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all block"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="secondary">{c.category}</Badge>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {c.hours}h • {c.level}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Trilha:{" "}
                  <span className="text-foreground">{c.trailTitle}</span>
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

// Suspense boundary necessário para useSearchParams no Next.js
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
