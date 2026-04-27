"use client";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImg from "@/assets/hero-training.jpg";

const stats = [
  { icon: Users, value: "12.000+", label: "Alunos" },
  { icon: Award, value: "50+", label: "Cursos" },
  { icon: TrendingUp, value: "98%", label: "Satisfação" },
];

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <Image src={heroImg} fill alt="Picture of the author" />

      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/85 to-navy/60" />
    </div>

    <div className="container mx-auto px-4 relative z-10 py-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🚀 Nova turma de Gestão de Pessoas aberta
          </span> */}

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground">
            Transforme o RH da sua empresa em{" "}
            <span className="text-accent">vantagem competitiva</span>
          </h1>

          <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed max-w-xl">
            Plataforma completa de cursos e treinamentos corporativos em
            Recursos Humanos. Capacite seu time com conteúdo prático e
            atualizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-[var(--shadow-gold)] text-base px-8"
            >
              Explorar Planos
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 hover:bg-primary-foreground/30 text-secondary bg-primary-foreground/10 font-semibold text-base hover:text-secondary"
            >
              Ver Cursos
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex gap-8 mt-16"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <s.icon size={18} className="text-accent" />
              </div>
              <div>
                <div className="text-xl font-bold text-primary-foreground font-display">
                  {s.value}
                </div>
                <div className="text-xs text-primary-foreground/50">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
