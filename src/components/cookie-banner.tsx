"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "qpz_cookie_consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // localStorage indisponível (SSR, iframe sandbox, etc.)
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg sm:left-4 sm:right-auto"
        >
          <div className="rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur-md p-5">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Cookie className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Aviso de Cookies
              </h3>
            </div>

            {/* Body */}
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência na plataforma e
              garantir o funcionamento de áreas seguras. Ao continuar navegando,
              você concorda com nossos{" "}
              <Link
                href="/termos-e-condicoes"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                Termos de Uso
              </Link>
              .
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={acceptCookies}
                size="sm"
                className="gap-1.5 text-xs"
              >
                <ShieldCheck className="size-3.5" />
                Entendi e Aceitar
              </Button>

              <Link
                href="/politicas-de-privacidade"
                className="text-xs font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
