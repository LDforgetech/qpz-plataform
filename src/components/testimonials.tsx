"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Edison Ferreira da Silva",
    role: "Presidente do SINDHOSFIL",
    company: "SINDHOSFIL",
    text: "Nós do SINDHOSFIL tivemos a honra de contar com a colaboração do Paulo em dois grandes eventos para o Sindicato. Ficamos extremamente lisonjeados com sua participação no nosso 9º ConSINDHOSFIL e no VI Seminário Multidisciplinar, ambos de grande relevância para nós e nossos filiados. O estimado amigo Paulo possui uma característica fundamental atrelada à sua oratória e performance, contribuindo genuinamente para que suas palestras sejam sempre muito proveitosas. Mais uma vez, parabenizamos pelo sucesso das palestras e agradecemos a parceria construída.",
    rating: 5,
  },
  {
    name: "Nadia Portuguese",
    role: "Head de Recursos Humanos",
    company: "Cetec",
    text: "O treinamento com a equipe da QuatroPontoZero foi fundamental para o momento que a Cetec está vivendo, trazendo mais clareza sobre processos, eliminação de desperdícios, cultivando equipes autônomas, engajadas e focadas na melhoria contínua. Excelente treinamento!",
    rating: 5,
  },
  {
    name: "Flávia Oliveira",
    role: "Coordenadora de Seleção, Treinamento e DHO",
    company: "Hnipo",
    text: "Liderança fortalecida e time engajado: a experiência com a Consultoria 4.0 em 2025 superou todas as nossas expectativas!",
    rating: 5,
  },
  {
    name: "Cléo Almeida",
    role: "Líder de Capital Humano Brasil",
    company: "Innovak",
    text: "A QuatroPontoZero superou nossas expectativas, valeu cada centavo do investimento. Parabéns pelo profissionalismo, pelo conhecimento transmitido e principalmente pela didática com que vocês apresentaram todos os os conteúdos à nossa equipe. Com certeza, cada um saiu do programa com lições aprendidas e boas recordações dos consultores.",
    rating: 4,
  },
  {
    name: "Bianca Santos",
    role: "Analista de Recursos Humanos",
    company: "Motul",
    text: "A qualidade dos instrutores e a organização dos módulos são excelentes. Valeu cada centavo do investimento na minha carreira.",
    rating: 5,
  },
  {
    name: "Danilo Sampaio",
    role: "Diretor Comercial",
    company: "Loglab",
    text: "Muito além de olhar as dificuldades da área de Recursos Humanos, a QuatroPontoZero olhou e tratou as dificuldades daqueles que conduzem e tomam decisões sobre a empresa… surpreendente!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Depoimentos
          </span>

          <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-foreground">
            O que dizem sobre nós
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Profissionais de RH de diferentes empresas já transformaram suas
            carreiras com a ElevareQPZ.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <Quote size={24} className="mb-4 text-accent/40" />

              <div className="mt-auto flex items-center gap-3 pb-4 mb-4 border-b border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-display font-semibold text-primary-foreground">
                  {testimonial.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <div className="text-sm font-display font-semibold text-foreground">
                    {testimonial.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    className={
                      starIndex < testimonial.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    }
                  />
                ))}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {'"' + testimonial.text + '"'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
