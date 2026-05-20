"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTrail } from "@/hooks/useTrails";
import Link from "next/link";
import Image from "next/image";

const TrailDetail = () => {
  const params = useParams();
  const { data: trail, isLoading, isError } = useTrail(params.slug as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !trail) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Trilha não encontrada
        </h1>
        <Link
          href="/dashboard"
          className="text-accent mt-4 inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Voltar ao dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-primary to-navy-dark rounded-2xl p-8 text-primary-foreground relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative">
          <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground mb-3 cursor-default">
            <Sparkles size={12} className="mr-1" /> Trilha de carreira
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            {trail.title}
          </h1>
          <p className="opacity-80 max-w-2xl mb-6">{trail.description}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-accent" />
              <span>{trail.courses_count} cursos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Courses */}
      <h2 className="text-xl font-display font-bold text-foreground mb-5">
        Cursos desta trilha
      </h2>
      <div className="space-y-3">
        {trail.courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              href={`/curso/${course.id}`}
              className="group bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[var(--shadow-card-hover)] transition-all"
            >
              <div className="w-80 h-44 rounded-lg bg-secondary overflow-hidden shrink-0">
                {course.cover_url ? (
                  <Image
                    width={320}
                    height={208}
                    src={course.cover_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary">
                    <span className="font-display font-bold">{i + 1}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground mt-0.5">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-navy-light shrink-0"
              >
                <Play size={14} fill="currentColor" />
                Ver curso
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrailDetail;
