"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Play,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
  Calendar,
  Home,
  Library,
  BarChart3,
  AwardIcon,
  BookUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DiagnosticForm from "@/components/diagnostic-form";
import Logo from "@/components/logo";
import { UserButton, useUser } from "@clerk/nextjs";

const inProgress = [
  {
    title: "Gestão Estratégica de Pessoas",
    category: "Liderança",
    progress: 64,
    nextLesson: "Módulo 4 — Feedback de alta performance",
    duration: "12 min",
  },
  {
    title: "Recrutamento & Seleção 4.0",
    category: "R&S",
    progress: 28,
    nextLesson: "Módulo 2 — Entrevista por competências",
    duration: "18 min",
  },
  {
    title: "Departamento Pessoal Completo",
    category: "DP",
    progress: 82,
    nextLesson: "Módulo 9 — Cálculo de rescisões",
    duration: "22 min",
  },
];

const recommended = [
  { title: "Cultura e Clima Organizacional", category: "Cultura", hours: 18 },
  { title: "Treinamento & Desenvolvimento", category: "T&D", hours: 20 },
  { title: "Compliance Trabalhista", category: "Jurídico", hours: 12 },
  { title: "People Analytics na Prática", category: "Dados", hours: 14 },
];

const stats = [
  { label: "Horas estudadas", value: "47h", icon: Clock },
  { label: "Cursos concluídos", value: "5", icon: Award },
  { label: "Sequência", value: "12 dias", icon: TrendingUp },
];

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeNav, setActiveNav] = useState("inicio");
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  const navItems = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "trilha", label: "Minha Trilha", icon: Sparkles },
    { id: "certificados", label: "Certificados", icon: AwardIcon },
    { id: "contato", label: "Contato", icon: BookUser },
  ];

  const planExpiresIn = 247;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-screen">
        <div className="p-6 border-b border-border">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Plano ativo */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-primary to-navy-light rounded-xl p-4 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Plano Profissional
              </span>
            </div>
            <p className="text-xs opacity-80 mb-3">
              Acesso liberado por mais {planExpiresIn} dias
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full bg-accent text-accent-foreground hover:bg-gold-dark text-xs"
            >
              Gerenciar plano
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Buscar cursos e/ou trilhas"
                className="pl-10 bg-secondary border-0"
              />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <Bell size={18} />
              </Button>
              {isLoaded && isSignedIn && (
                <UserButton afterSignOutUrl="/" showName />
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-foreground">
              Bom te ver de volta, {user?.firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue de onde parou e mantenha sua sequência de estudos.
            </p>
          </motion.div>

          {/* Trilha personalizada CTA */}
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
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Continue assistindo */}
          {/* <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-bold text-foreground">
                Continue de onde parou
              </h2>
              <a
                href="#"
                className="text-sm font-semibold text-accent hover:text-gold-dark flex items-center gap-1"
              >
                Ver todos <ChevronRight size={14} />
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {inProgress.map((course, i) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer"
                >
                  <div className="relative h-32 bg-gradient-to-br from-primary to-navy-light flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play
                        size={20}
                        className="text-accent-foreground ml-0.5"
                        fill="currentColor"
                      />
                    </div>
                    <Badge className="absolute top-3 left-3 bg-card/90 text-foreground hover:bg-card">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-foreground line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {course.nextLesson}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {course.progress}%
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> {course.duration}
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section> */}

          {/* Recomendados */}
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
                Ver biblioteca <ChevronRight size={14} />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((course, i) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-card border border-border rounded-xl p-5 hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {course.category}
                  </span>
                  <h3 className="font-display font-semibold text-foreground mt-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                    <Clock size={12} /> {course.hours}h de conteúdo
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Próximo evento */}
          <section className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          </section>
        </main>
      </div>
      <DiagnosticForm open={diagnosticOpen} onOpenChange={setDiagnosticOpen} />
    </div>
  );
};

export default Dashboard;
