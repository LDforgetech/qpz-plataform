"use client";

import {
  Megaphone,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { SupportForm } from "@/components/support-form";

const ombudsmanInfo = [
  {
    icon: ShieldCheck,
    title: "Canal independente",
    description:
      "Recebemos reclamações, denúncias, sugestões e elogios de forma imparcial.",
  },
  {
    icon: Clock,
    title: "Prazo de resposta",
    description: "Nosso compromisso é enviar uma resposta em até 7 dias úteis.",
  },
];

const Ombudsman = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        {/* Hero */}
        <div className="relative overflow-hidden bg-primary py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-80" />
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4 pt-10">
                <Megaphone className="text-accent" size={20} />
                <span className="text-accent text-sm  font-medium uppercase tracking-wider">
                  Canal de Ouvidoria
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
                Fale com a Ouvidoria
              </h1>
              <p className="text-primary-foreground/70 leading-relaxed">
                Reclamações, denúncias, sugestões ou elogios. Sua manifestação é
                analisada com atenção e sigilo.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  <SupportForm type="ouvidoria" />
                </CardContent>
              </Card>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              {ombudsmanInfo.map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-primary to-navy-light rounded-xl p-6 text-primary-foreground"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <item.icon className=" text-accent" size={18} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg mb-2">
                        {item.title}
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
      <Footer />
    </>
  );
};

export default Ombudsman;
