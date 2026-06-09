"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCourses } from "@/hooks/useCourses";
import { useTrails } from "@/hooks/useTrails";
import {
  Play,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DiagnosticForm from "@/components/diagnostic-form";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";

type Course = {
  id: number;
  title: string;
  description: string;
  cover_url: string;
};

const stats = [
  { label: "Horas estudadas", value: "47h", icon: Clock },
  { label: "Cursos concluídos", value: "5", icon: Award },
  { label: "Sequência", value: "12 dias", icon: TrendingUp },
];

const Dashboard = () => {
  const { user } = useUser();
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const { data: profileData } = useProfile();

  const { data: rawCourses = [], isLoading } = useCourses();
  const courses = rawCourses as Course[];

  const { data: trails = [], isLoading: isLoadingTrails } = useTrails();

  const planExpiresIn = 247;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground">
            {profileData ? "Bom te ver de volta," : "Seja Bem-vindo,"}{" "}
            {user?.firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Continue de onde parou e mantenha sua sequência de estudos.
          </p>
        </motion.div>
        {/* Trilha personalizada CTA */}
        {!profileData && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 bg-gradient-to-br from-primary to-navy-dark rounded-2xl p-8 text-primary-foreground relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  Trace seu perfil profissional
                </h2>
                <p className="opacity-80 max-w-xl">
                  Responda um diagnóstico rápido e receba uma trilha de estudos
                  personalizada com base no seu momento de carreira.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setDiagnosticOpen(true)}
                className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-[var(--shadow-gold)]"
              >
                <Sparkles size={18} />
                Iniciar diagnóstico
              </Button>
            </div>
          </motion.section>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Cursos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">
                Catálogo de cursos
              </h2>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-accent hover:text-gold-dark flex items-center gap-1"
            >
              Ver todos <ChevronRight size={14} />
            </a>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary text-primary"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer flex flex-col"
                >
                  <Link
                    href={`/curso/${course.id}`}
                    className="flex flex-col flex-1"
                  >
                    <div className="w-full h-40 bg-secondary relative overflow-hidden">
                      {course.cover_url ? (
                        <Image
                          width={287}
                          height={160}
                          src={course.cover_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary">
                          <BookOpen size={32} className="opacity-50" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-auto p-2 rounded-md w-fit transition-colors duration-300 group-hover:bg-accent group-hover:text-foreground">
                        <Play size={12} /> Acessar curso
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
        {/* Próximo evento */}
        {/* <section className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Live ao vivo • Quinta, 19h
              </p>
              <h3 className="font-display font-semibold text-foreground mt-1">
                Tendências de RH para 2026 com Ana Beatriz Coutinho
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Inscreva-se gratuitamente como assinante.
              </p>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-navy-light shrink-0">
            Reservar vaga
          </Button>
        </section> */}

        {/* Trilha de cursos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">
                Trilhas de carreira
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sequências de cursos pensadas para o seu próximo passo
              </p>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-accent hover:text-gold-dark flex items-center gap-1"
            >
              Ver todas <ChevronRight size={14} />
            </a>
          </div>

          {isLoadingTrails ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary text-primary"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trails.map((trail, i) => (
                <motion.div
                  key={trail.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/trilha/${trail.slug}`}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer block h-full flex flex-col"
                  >
                    {trail.thumbnail ? (
                      <div className="w-full h-36 bg-secondary relative overflow-hidden">
                        <Image
                          width={400}
                          height={144}
                          src={trail.thumbnail}
                          alt={trail.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-36 bg-secondary flex items-center justify-center">
                        <Layers size={32} className="text-primary opacity-50" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <Badge
                        variant="secondary"
                        className="self-start text-[10px] mb-2"
                      >
                        Trilha
                      </Badge>
                      <h3 className="font-display font-semibold text-foreground line-clamp-2">
                        {trail.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1">
                        {trail.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} /> {trail.courses_count} cursos
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <DiagnosticForm open={diagnosticOpen} onOpenChange={setDiagnosticOpen} />
    </div>
  );
};

export default Dashboard;
