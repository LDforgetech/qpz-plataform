"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { usePlans } from "@/hooks/usePlans";
import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  onlyDigits,
  isValidCPF,
  isValidCNPJ,
} from "@/lib/masks";
import type {
  Plan,
  PaymentMethod,
  DocumentType,
  CheckoutProcessPayload,
  CheckoutProcessResponse,
} from "@/types/subscription";

// ── Zod Schema ──────────────────────────────────────────────────────

const checkoutSchema = z
  .object({
    name: z.string({ error: "Nome é obrigatório" }).min(3, "Nome muito curto"),
    email: z.string({ error: "E-mail é obrigatório" }).email("E-mail inválido"),
    document_type: z.enum(["cpf", "cnpj"] as const, {
      error: "Selecione o tipo de documento",
    }),
    document: z
      .string({ error: "Documento é obrigatório" })
      .min(1, "Documento é obrigatório"),
    phone: z
      .string({ error: "Celular é obrigatório" })
      .min(10, "Celular inválido"),
    payment_method: z.enum(
      ["pix", "credit_card", "boleto", "stripe"] as const,
      { error: "Selecione um método de pagamento" },
    ),
  })
  .superRefine((data, ctx) => {
    // ── Validação de documento ──────────────────
    const digits = onlyDigits(data.document);

    if (data.document_type === "cpf") {
      if (digits.length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["document"],
          message: "CPF deve ter 11 dígitos",
        });
      } else if (!isValidCPF(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["document"],
          message: "CPF inválido",
        });
      }
    }

    if (data.document_type === "cnpj") {
      if (digits.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["document"],
          message: "CNPJ deve ter 14 dígitos",
        });
      } else if (!isValidCNPJ(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["document"],
          message: "CNPJ inválido",
        });
      }
    }
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ── Tipos de estado pós-submit ──────────────────────────────────────

type CheckoutState =
  | { step: "form" }
  | { step: "submitting" }
  | {
      step: "pix";
      qr_code_base64?: string;
      copy_paste_code?: string;
    }
  | { step: "boleto"; url: string }
  | { step: "redirecting"; url?: string };

// ── Helpers ─────────────────────────────────────────────────────────

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "pix",
    label: "Pix",
    description: "Aprovação instantânea",
    icon: <QrCode size={20} />,
  },
  {
    value: "credit_card",
    label: "Cartão de Crédito",
    description: "Até 12x sem juros",
    icon: <CreditCard size={20} />,
  },
  {
    value: "boleto",
    label: "Boleto Bancário",
    description: "Compensação em 1-3 dias úteis",
    icon: <Landmark size={20} />,
  },
  // {
  //   value: "stripe",
  //   label: "Stripe",
  //   description: "Cartão internacional",
  //   icon: <Zap size={20} />,
  // },
];

const formatBRL = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// ── Seção Numerada ──────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
        {number}
      </div>
      <h2 className="text-lg font-display font-bold text-foreground">
        {title}
      </h2>
    </div>
  );
}

// ── Campo com erro ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 text-xs text-destructive"
    >
      {message}
    </motion.p>
  );
}

// ── Order Summary (Coluna Direita) ──────────────────────────────────

function OrderSummary({
  plan,
  isLoading,
}: {
  plan: Plan | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !plan) {
    return (
      <div className="rounded-2xl bg-card border border-border p-8 animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-10 bg-muted rounded w-1/3 mt-6" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-muted rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-primary text-primary-foreground p-8 shadow-[var(--shadow-gold)] relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Seu pedido
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
        <p className="text-sm mt-1 text-primary-foreground/70">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mt-6 mb-8 pb-6 border-b border-primary-foreground/10">
          {plan.price !== "Sob consulta" ? (
            <div className="">
              <span
                className={`text-sm ${plan.highlighted ? "text-primary-foreground/30" : "text-muted-foreground"}`}
              >
                em até 12x de
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm">R$</span>
                <span className="text-4xl font-bold font-display leading-7">
                  {(+plan.price / 12).toFixed(2)}
                </span>
              </div>
              <span
                className={`text-sm ${plan.highlighted ? "text-primary-foreground/30" : "text-muted-foreground"}`}
              >
                ou à vista por R$ {plan.price}
              </span>

              {/* <span className="text-sm text-primary-foreground/70">R$</span>
              <span className="text-4xl font-bold font-display">
                {plan.price}
              </span> */}
            </div>
          ) : (
            <span className="text-2xl font-bold font-display">
              {plan.price}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>{f.item}</span>
            </li>
          ))}
        </ul>

        {/* Security badge */}
        <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/5 px-4 py-3">
          <ShieldCheck size={16} className="text-accent shrink-0" />
          <span className="text-xs text-primary-foreground/70">
            Pagamento 100% seguro · Dados criptografados
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Tela de PIX ─────────────────────────────────────────────────────

function PixScreen({
  qrCodeBase64,
  copyPasteCode,
}: {
  qrCodeBase64?: string;
  copyPasteCode?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!copyPasteCode) return;
    try {
      await navigator.clipboard.writeText(copyPasteCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  }, [copyPasteCode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center space-y-6 py-8"
    >
      {/* Header */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <QrCode className="h-8 w-8 text-accent" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Pague com Pix
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Escaneie o QR Code abaixo com o app do seu banco ou copie o código
          para pagar.
        </p>
      </div>

      {/* QR Code */}
      {qrCodeBase64 && (
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <img
            src={
              qrCodeBase64.startsWith("data:")
                ? qrCodeBase64
                : `data:image/png;base64,${qrCodeBase64}`
            }
            alt="QR Code Pix"
            className="h-56 w-56"
          />
        </div>
      )}

      {/* Copy-paste code */}
      {copyPasteCode && (
        <div className="w-full max-w-md space-y-3">
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">
              Código Pix Copia e Cola
            </p>
            <p className="text-xs font-mono text-foreground break-all leading-relaxed">
              {copyPasteCode}
            </p>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copiar código
              </>
            )}
          </Button>
        </div>
      )}

      {/* Waiting indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Aguardando confirmação do pagamento...
      </div>
    </motion.div>
  );
}

// ── Tela de Boleto ──────────────────────────────────────────────────

function BoletoScreen({ url }: { url: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center space-y-6 py-8"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <Landmark className="h-8 w-8 text-accent" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Boleto gerado!
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Clique no botão abaixo para visualizar e pagar o boleto. A compensação
          ocorre em 1 a 3 dias úteis.
        </p>
      </div>

      <Button className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold">
        <a href={url} target="_blank" rel="noopener noreferrer">
          Abrir Boleto
        </a>
      </Button>

      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Ir para o Dashboard
      </Link>
    </motion.div>
  );
}

// ── Componente Principal ────────────────────────────────────────────

export default function CheckoutPage() {
  const params = useParams<{ planId: string }>();
  const router = useRouter();
  const planId = Number(params.planId);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const selectedPlan = plans?.find((p) => p.id === planId);

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: "form",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(checkoutSchema as any),
    defaultValues: {
      name: "",
      email: "",
      document_type: "cpf",
      document: "",
      phone: "",
      payment_method: "pix",
    },
  });

  const watchDocType = watch("document_type") as DocumentType;

  // ── Submit handler ──────────────────────────────────────────────

  const onSubmit = async (data: CheckoutFormData) => {
    setCheckoutState({ step: "submitting" });

    const payload: CheckoutProcessPayload = {
      plan_id: planId,
      name: data.name,
      email: data.email,
      document_type: data.document_type as DocumentType,
      document: onlyDigits(data.document),
      phone: onlyDigits(data.phone),
      payment_method: data.payment_method as PaymentMethod,
    };

    try {
      const response = await api.post<CheckoutProcessResponse>(
        "checkout/process",
        payload,
      );

      switch (response.type) {
        case "redirect":
          if (response.url) {
            setCheckoutState({ step: "redirecting", url: response.url });
            window.open(response.url, "_blank");
          }
          break;

        case "pix":
          setCheckoutState({
            step: "pix",
            qr_code_base64: response.qr_code_base64,
            copy_paste_code: response.copy_paste_code,
          });
          break;

        case "boleto":
          if (response.url) {
            setCheckoutState({ step: "boleto", url: response.url });
          }
          break;

        case "success":
          toast.success("Pagamento confirmado!");
          router.push("/dashboard?success=true");
          break;

        default:
          toast.error("Resposta inesperada do servidor.");
          setCheckoutState({ step: "form" });
      }
    } catch (err) {
      setCheckoutState({ step: "form" });

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        toast.error(
          "Erro de conexão. Verifique sua internet e tente novamente.",
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  // ── Telas pós-submit ───────────────────────────────────────────

  if (checkoutState.step === "pix") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-8">
          <Link
            href={`/checkout/${planId}`}
            onClick={(e) => {
              e.preventDefault();
              setCheckoutState({ step: "form" });
            }}
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao checkout
          </Link>

          <PixScreen
            qrCodeBase64={checkoutState.qr_code_base64}
            copyPasteCode={checkoutState.copy_paste_code}
          />
        </div>
      </div>
    );
  }

  if (checkoutState.step === "boleto") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-8">
          <BoletoScreen url={checkoutState.url} />
        </div>
      </div>
    );
  }

  if (checkoutState.step === "redirecting") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center text-center space-y-6 max-w-sm px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-card border border-border rounded-full p-6">
              <ShieldCheck className="h-10 w-10 text-accent" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Aberto em nova aba!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A tela de pagamento seguro foi aberta em uma nova guia. Conclua o
              pagamento por lá.
            </p>
          </div>

          <div className="space-y-3 w-full pt-4">
            {checkoutState.url && (
              <Button variant="outline" className="w-full">
                <a
                  href={checkoutState.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir link novamente
                </a>
              </Button>
            )}

            <Button variant="ghost" className="w-full text-muted-foreground">
              <Link href="/dashboard">Ir para o Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulário Principal ────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/#planos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar aos planos
          </Link>

          <h1 className="mt-3 text-3xl font-display font-bold text-foreground">
            Finalizar compra
          </h1>
          <p className="mt-1 text-muted-foreground">
            Complete os dados abaixo para ativar seu plano.
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          {/* ── Coluna Esquerda: Formulário ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
              noValidate
            >
              {/* ── Seção 1: Resumo ────────────────────────────── */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <SectionHeader number={1} title="Resumo do plano" />

                {plansLoading && (
                  <div className="h-16 rounded-lg bg-muted animate-pulse" />
                )}

                {selectedPlan && (
                  <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-5 py-4">
                    <div>
                      <p className="font-display font-bold text-foreground">
                        {selectedPlan.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlan.description}
                      </p>
                    </div>
                  </div>
                )}

                {!plansLoading && !selectedPlan && (
                  <div className="rounded-xl bg-destructive/5 border border-destructive/20 px-5 py-4 text-center">
                    <p className="text-sm text-destructive font-medium">
                      Plano não encontrado. Verifique o link e tente novamente.
                    </p>
                  </div>
                )}
              </section>

              {/* ── Seção 2: Dados Pessoais ─────────────────────── */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <SectionHeader number={2} title="Seus dados" />

                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="checkout-name">Nome completo</Label>
                    <Input
                      id="checkout-name"
                      placeholder="Seu nome completo"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      {...register("name")}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="checkout-email">E-mail</Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  {/* Tipo de documento + Documento */}
                  <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                    {/* Document type selector */}
                    <div>
                      <Label>Tipo de documento</Label>
                      <Controller
                        name="document_type"
                        control={control}
                        render={({ field }) => (
                          <div className="flex gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange("cpf");
                                setValue("document", "");
                              }}
                              className={cn(
                                "flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                                field.value === "cpf"
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border bg-background text-muted-foreground hover:border-foreground/20",
                              )}
                            >
                              CPF
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange("cnpj");
                                setValue("document", "");
                              }}
                              className={cn(
                                "flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                                field.value === "cnpj"
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-border bg-background text-muted-foreground hover:border-foreground/20",
                              )}
                            >
                              CNPJ
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {/* Document input with mask */}
                    <div>
                      <Label htmlFor="checkout-document">
                        {watchDocType === "cnpj" ? "CNPJ" : "CPF"}
                      </Label>
                      <Controller
                        name="document"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="checkout-document"
                            placeholder={
                              watchDocType === "cnpj"
                                ? "00.000.000/0000-00"
                                : "000.000.000-00"
                            }
                            inputMode="numeric"
                            autoComplete="off"
                            aria-invalid={!!errors.document}
                            value={field.value}
                            onChange={(e) => {
                              const masked =
                                watchDocType === "cnpj"
                                  ? maskCNPJ(e.target.value)
                                  : maskCPF(e.target.value);
                              field.onChange(masked);
                            }}
                          />
                        )}
                      />
                      <FieldError message={errors.document?.message} />
                    </div>

                    {/* Phone input with mask */}
                    <div>
                      <Label htmlFor="checkout-phone">Celular</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="checkout-phone"
                            placeholder="(11) 99999-9999"
                            inputMode="numeric"
                            autoComplete="tel"
                            aria-invalid={!!errors.phone}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(maskPhone(e.target.value));
                            }}
                          />
                        )}
                      />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Seção 3: Pagamento ──────────────────────────── */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <SectionHeader number={3} title="Forma de pagamento" />

                <Controller
                  name="payment_method"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {PAYMENT_OPTIONS.map((option) => {
                        const isSelected = field.value === option.value;
                        return (
                          <label
                            key={option.value}
                            htmlFor={`payment-${option.value}`}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all",
                              isSelected
                                ? "border-accent bg-accent/5 shadow-sm"
                                : "border-border bg-background hover:border-foreground/20",
                            )}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`payment-${option.value}`}
                            />
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                isSelected
                                  ? "bg-accent/10 text-accent"
                                  : "bg-secondary text-muted-foreground",
                              )}
                            >
                              {option.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">
                                {option.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  )}
                />
                <FieldError message={errors.payment_method?.message} />
              </section>

              {/* ── Botão de Submit ─────────────────────────────── */}
              <Button
                type="submit"
                size="lg"
                disabled={
                  checkoutState.step === "submitting" ||
                  !selectedPlan ||
                  plansLoading
                }
                className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-semibold text-base h-14 rounded-xl shadow-[var(--shadow-gold)]"
              >
                {checkoutState.step === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Finalizar Compra
                  </>
                )}
              </Button>

              {/* Security disclaimer */}
              <p className="text-center text-xs text-muted-foreground">
                <Lock size={10} className="inline mr-1" />
                Seus dados estão protegidos com criptografia de ponta a ponta.
              </p>
            </form>
          </motion.div>

          {/* ── Coluna Direita: Order Summary (sticky) ──────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <OrderSummary plan={selectedPlan} isLoading={plansLoading} />
            </div>
          </div>

          {/* Mobile: Order summary above form (rendered at top on mobile) */}
          <div className="lg:hidden -order-1">
            <OrderSummary plan={selectedPlan} isLoading={plansLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
