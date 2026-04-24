"use client";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    title: "Gestão Estratégica de Pessoas",
    category: "Liderança",
    hours: 24,
    students: 1840,
    rating: 4.9,
    description:
      "Desenvolva competências para liderar equipes de alta performance com foco em resultados.",
    badge: "Mais Popular",
  },
  {
    title: "Recrutamento & Seleção 4.0",
    category: "R&S",
    hours: 16,
    students: 1250,
    rating: 4.8,
    description:
      "Técnicas modernas de atração de talentos com uso de People Analytics e IA.",
    badge: null,
  },
  {
    title: "Departamento Pessoal Completo",
    category: "DP",
    hours: 40,
    students: 3200,
    rating: 4.9,
    description:
      "Da admissão à rescisão: domine todos os processos do departamento pessoal.",
    badge: "Certificado",
  },
  {
    title: "Treinamento & Desenvolvimento",
    category: "T&D",
    hours: 20,
    students: 980,
    rating: 4.7,
    description:
      "Crie programas de capacitação que geram impacto real nos indicadores do negócio.",
    badge: null,
  },
  {
    title: "Compliance Trabalhista",
    category: "Jurídico",
    hours: 12,
    students: 760,
    rating: 4.8,
    description:
      "Garanta conformidade legal e reduza riscos trabalhistas na sua organização.",
    badge: "Novo",
  },
  {
    title: "Cultura e Clima Organizacional",
    category: "Cultura",
    hours: 18,
    students: 1100,
    rating: 4.9,
    description:
      "Construa uma cultura empresarial forte que engaje e retenha os melhores talentos.",
    badge: null,
  },
];

const FeaturedCourses = () => (
  <section id="cursos" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-accent font-semibold text-sm uppercase tracking-widest">
          Catálogo
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
          Cursos em Destaque
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Conteúdos desenvolvidos por especialistas com experiência de mercado,
          atualizados com as últimas tendências de RH.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group bg-card rounded-xl border border-border p-6 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {course.category}
              </span>
              {course.badge && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {course.badge}
                </Badge>
              )}
            </div>

            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-navy-light transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {course.hours}h
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {course.students.toLocaleString("pt-BR")}
              </span>
              <span className="flex items-center gap-1 text-accent">
                <Star size={14} fill="currentColor" /> {course.rating}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-gold-dark transition-colors"
        >
          <BookOpen size={16} />
          Ver todos os cursos →
        </a>
      </div>
    </div>
  </section>
);

export default FeaturedCourses;
