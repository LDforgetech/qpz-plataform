"use client";
import { useState } from "react";
import { Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const { data, isLoading: isSubLoading } = useSubscriptionStatus({
    enabled: !!isSignedIn,
  });

  const links = [
    { label: "Início", href: "./" },
    { label: "Cursos", href: "./#cursos" },
    { label: "Planos", href: "./#planos" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16">
        <Logo width={280} />
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
              <SignInButton mode="modal" forceRedirectUrl="/#planos">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Entrar
                </Button>
              </SignInButton>

              {/* Adicionado forceRedirectUrl */}
              <SignUpButton mode="modal" forceRedirectUrl="/#planos">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/70 font-semibold shadow-sm"
                >
                  Criar Conta
                </Button>
              </SignUpButton>
            </>
          )}

          <div className="flex items-center justify-center gap-2">
            {isSignedIn && isSubLoading && (
              <Button
                disabled
                className="h-8 w-[100px] opacity-50 bg-accent text-accent-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            )}
            {isSignedIn && !isSubLoading && data?.is_active && (
              <Link href="./dashboard">
                <Button className="bg-accent text-accent-foreground h-8">
                  Dashboard
                </Button>
              </Link>
            )}
            {isLoaded && isSignedIn && <UserButton showName />}
          </div>
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
                <SignInButton mode="modal" forceRedirectUrl="/#planos">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground w-full"
                  >
                    Entrar
                  </Button>
                </SignInButton>

                {/* Adicionado forceRedirectUrl no Mobile */}
                <SignUpButton mode="modal" forceRedirectUrl="/#planos">
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold w-full"
                  >
                    Criar conta
                  </Button>
                </SignUpButton>
              </>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex flex-col items-center w-full gap-3 py-2 border-t border-border mt-2">
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-sm font-medium text-foreground">
                    Sua Conta
                  </span>
                  <UserButton />
                </div>
                {isSubLoading ? (
                  <Button disabled className="w-full bg-accent opacity-50 h-9">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : data?.is_active ? (
                  <Link href="./dashboard" className="w-full">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-dark h-9">
                      Acessar Dashboard
                    </Button>
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
