"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  const links = [
    { label: "Início", href: "#" },
    { label: "Cursos", href: "#cursos" },
    { label: "Planos", href: "#planos" },
  ];

  // Defina a rota para onde o usuário deve ir após logar/cadastrar
  const redirectUrl = "./dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16">
        <Logo />
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
          {isLoaded && !isSignedIn && (
            <>
              {/* Adicionado forceRedirectUrl */}
              <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Entrar
                </Button>
              </SignInButton>

              {/* Adicionado forceRedirectUrl */}
              <SignUpButton mode="modal" forceRedirectUrl={redirectUrl}>
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/70 font-semibold shadow-sm"
                >
                  Começar Agora
                </Button>
              </SignUpButton>
            </>
          )}
          {isLoaded && isSignedIn && (
            <div className="flex items-center justify-center gap-2">
              <Link href="./dashboard">
                <Button className="bg-accent text-accent-foreground hover:bg-gold-dar h-8">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" showName />
            </div>
          )}
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
            {isLoaded && !isSignedIn && (
              <>
                {/* Adicionado forceRedirectUrl no Mobile */}
                <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground w-full"
                  >
                    Entrar
                  </Button>
                </SignInButton>

                {/* Adicionado forceRedirectUrl no Mobile */}
                <SignUpButton mode="modal" forceRedirectUrl={redirectUrl}>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold w-full"
                  >
                    Começar Agora
                  </Button>
                </SignUpButton>
              </>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center justify-center w-full py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
