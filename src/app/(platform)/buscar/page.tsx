import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { searchAllFull } from "@/lib/search";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const results = useMemo(() => searchAllFull(query), [query]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Search size={14} />
            <span>Resultados da busca</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {query ? <>Resultados para “{query}”</> : "Faça uma busca"}
          </h1>
          {query && (
            <p className="text-sm text-muted-foreground mt-1">
              {results.total}{" "}
              {results.total === 1
                ? "resultado encontrado"
                : "resultados encontrados"}
            </p>
          )}
        </div>

        {query && results.total === 0 && (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <p className="text-muted-foreground">
              Não encontramos nada para{" "}
              <span className="font-semibold text-foreground">“{query}”</span>.
            </p>
          </div>
        )}

        {results.trails.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Trilhas ({results.trails.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.trails.map((t) => (
                <Link
                  key={t.slug}
                  to={`/trilha/${t.slug}`}
                  className="group bg-card border border-border rounded-xl p-5 hover:shadow-[var(--shadow-card-hover)] transition-all block"
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
          </section>
        )}

        {results.courses.length > 0 && (
          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-accent" />
              Cursos ({results.courses.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.courses.map((c) => (
                <Link
                  key={c.slug}
                  to={`/curso/${c.slug}`}
                  className="group bg-card border border-border rounded-xl p-5 hover:shadow-[var(--shadow-card-hover)] transition-all block"
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
          </section>
        )}
      </div>
    </AppLayout>
  );
};

export default SearchResults;
