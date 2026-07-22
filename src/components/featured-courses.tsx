"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/useCourses";

function CoursesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-xl border border-border bg-card animate-pulse"
        >
          <div className="h-44 bg-muted" />

          <div className="p-6">
            <div className="mb-4 h-3 w-20 rounded bg-muted" />
            <div className="mb-3 h-6 w-4/5 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedCourses() {
  const { data: allCourses, isLoading, isError } = useCourses();

  // Mostra no máximo 6 cursos na landing page
  const courses = allCourses?.slice(0, 6) ?? [];

  return (
    <section id="cursos" className="scroll-mt-20 bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Catálogo
          </span>

          <h2 className="mt-2 text-3xl font-display font-bold text-foreground md:text-4xl">
            Cursos em Destaque
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Conteúdos desenvolvidos por especialistas com experiência de
            mercado, atualizados com as últimas tendências de RH.
          </p>
        </motion.div>

        {isLoading && <CoursesSkeleton />}

        {isError && (
          <div className="text-center text-muted-foreground">
            Não foi possível carregar os cursos. Tente novamente mais tarde.
          </div>
        )}

        {!isLoading && !isError && courses.length === 0 && (
          <div className="text-center text-muted-foreground">
            Nenhum curso disponível no momento.
          </div>
        )}

        {!isLoading && !isError && courses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {course.cover_url ? (
                    <Image
                      src={course.cover_url}
                      alt={`Capa do curso ${course.title}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <BookOpen size={36} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge className="bg-primary text-xs text-primary-foreground">
                      Curso
                    </Badge>
                  </div>

                  <h3 className="line-clamp-2 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-navy-light">
                    {course.title}
                  </h3>

                  <p
                    className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground"
                    title={course.description}
                  >
                    {course.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="#planos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-gold-dark"
          >
            <BookOpen size={16} />
            Ver planos e acessar os cursos →
          </a>
        </div>
      </div>
    </section>
  );
}
