"use client";

import { Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SupportForm } from "@/components/support-form";

const contactInfo = [
  {
    icon: Mail,
    label: "E-mail",
    value: "suporte@capitalhumano.com.br",
    description: "Respondemos em até 72h",
  },
];

export default function ContactPage() {
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
                <SupportForm type="contato" />
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((item) => (
              <div
                key={item.value}
                className="bg-gradient-to-br from-primary to-navy-light rounded-xl p-6 text-primary-foreground"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className=" text-accent" size={18} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg">
                      {item.label}
                    </h3>

                    <p className="text-sm text-primary-foreground/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
