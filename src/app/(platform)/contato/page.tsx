"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, MessageCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Mail,
    label: "E-mail",
    value: "suporte@capitalhumano.com.br",
    description: "Respondemos em até 36h",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-primary py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-80" />

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle className="text-accent" size={20} />

              <span className="text-accent text-sm font-medium uppercase tracking-wider">
                Fale Conosco
              </span>
            </div>

            <h1 className="font-display mb-3 text-3xl font-bold text-primary-foreground md:text-4xl">
              Entre em contato
            </h1>

            <p className="text-primary-foreground/70 leading-relaxed">
              Tem alguma dúvida, sugestão ou precisa de ajuda? Nossa equipe está
              pronta para atender você.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border-border/60">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle className="text-emerald-500" size={32} />
                    </div>

                    <h3 className="font-display mb-2 text-xl font-bold text-foreground">
                      Mensagem enviada!
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      Agradecemos pelo contato. Responderemos o mais breve
                      possível.
                    </p>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);

                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Enviar nova mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>

                        <Input
                          id="name"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>

                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>

                      <Input
                        id="subject"
                        placeholder="Qual o motivo do contato?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subject: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>

                      <Textarea
                        id="message"
                        placeholder="Descreva sua dúvida ou solicitação..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2 sm:w-auto">
                      <Send size={16} />
                      Enviar mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((item) => (
              <Card key={item.label} className="border-border/60">
                <CardContent className="flex items-center gap-4 px-5 py-0">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <item.icon className="text-primary" size={18} />
                  </div>

                  <div>
                    <p className="text-md font-bold text-foreground">
                      {item.label}
                    </p>

                    <p className="text-sm text-foreground">{item.value}</p>

                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* CTA */}
            <div className="from-primary to-navy-light mt-6 rounded-xl bg-gradient-to-br p-6 text-primary-foreground">
              <h3 className="font-display mb-2 text-lg font-bold">
                Precisa de ajuda urgente?
              </h3>

              <p className="text-primary-foreground/70 mb-4 text-sm">
                Acesse nossa central de ajuda com artigos e tutoriais sobre a
                plataforma.
              </p>

              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-gold-dark text-xs"
                >
                  Ir para a central
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
