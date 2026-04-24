"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Início", href: "#" },
    { label: "Cursos", href: "#cursos" },
    { label: "Planos", href: "#planos" },
    { label: "Sobre", href: "#sobre" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display text-sm font-bold text-primary-foreground">
              RH
            </span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            CapitalHumano<span className="text-accent">.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Entrar
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold shadow-sm"
          >
            Começar Agora
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Entrar
            </Button>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
