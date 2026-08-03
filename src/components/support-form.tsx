"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { api } from "@/lib/api";
import {
  supportFormSchema,
  ouvidoriaFormSchema,
  type SupportFormData,
  type OuvidoriaFormData,
  type SupportType,
} from "@/lib/schemas/support-form";

// ── Props ───────────────────────────────────────────────────────────
interface SupportFormProps {
  type: SupportType;
}

// ── Payload enviado à API ───────────────────────────────────────────
interface SupportPayload extends SupportFormData {
  type: SupportType;
  recaptchaToken?: string;
}

// ── Component ───────────────────────────────────────────────────────
export function SupportForm({ type }: SupportFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isOuvidoria = type === "ouvidoria";

  // Seleciona o schema correto conforme o tipo
  const schema = isOuvidoria ? ouvidoriaFormSchema : supportFormSchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SupportFormData | OuvidoriaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      ...(isOuvidoria ? { recaptchaToken: "" } : {}),
    },
  });

  // ── Submit handler ──────────────────────────────────────────────
  const onSubmit = async (data: SupportFormData | OuvidoriaFormData) => {
    setIsLoading(true);

    try {
      const payload: SupportPayload = {
        ...data,
        type,
      };

      await api.post("support/message", payload);

      toast.success(
        isOuvidoria
          ? "Manifestação registrada com sucesso!"
          : "Mensagem enviada com sucesso!",
        {
          description: isOuvidoria
            ? "Analisaremos sua manifestação e responderemos em até 7 dias úteis."
            : "Responderemos o mais breve possível.",
        },
      );

      reset();
    } catch (error) {
      console.error("[SupportForm] Erro ao enviar:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Tente novamente em alguns instantes.";

      toast.error("Erro ao enviar", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Helpers de erro ─────────────────────────────────────────────
  const fieldError = (field: keyof SupportFormData) =>
    errors[field]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nome + E-mail */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sf-name">Nome completo</Label>
          <Input
            id="sf-name"
            placeholder="Seu nome"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {fieldError("name") && (
            <p className="text-sm text-destructive">{fieldError("name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sf-email">E-mail</Label>
          <Input
            id="sf-email"
            type="email"
            placeholder="seu@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {fieldError("email") && (
            <p className="text-sm text-destructive">{fieldError("email")}</p>
          )}
        </div>
      </div>

      {/* Assunto */}
      <div className="space-y-2">
        <Label htmlFor="sf-subject">Assunto</Label>
        <Input
          id="sf-subject"
          placeholder={
            isOuvidoria
              ? "Tipo de manifestação (ex: Reclamação, Sugestão...)"
              : "Qual o motivo do contato?"
          }
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />
        {fieldError("subject") && (
          <p className="text-sm text-destructive">{fieldError("subject")}</p>
        )}
      </div>

      {/* Mensagem */}
      <div className="space-y-2">
        <Label htmlFor="sf-message">
          {isOuvidoria ? "Descrição da manifestação" : "Mensagem"}
        </Label>
        <Textarea
          id="sf-message"
          placeholder={
            isOuvidoria
              ? "Descreva os detalhes da sua manifestação de forma clara e objetiva..."
              : "Descreva sua dúvida ou solicitação..."
          }
          rows={5}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {fieldError("message") && (
          <p className="text-sm text-destructive">{fieldError("message")}</p>
        )}
      </div>

      {isOuvidoria && (
        <div className="space-y-2">
          <ReCAPTCHA
            sitekey={
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
              "6Ld7g2YtAAAAAPBM-QErYZobiLE9crVSpMObG-Qx"
            }
            onChange={(token) => {
              if (token) {
                setValue("recaptchaToken", token, { shouldValidate: true });
                clearErrors("recaptchaToken");
              } else {
                setValue("recaptchaToken", "");
              }
            }}
          />
          {"recaptchaToken" in errors && errors.recaptchaToken?.message && (
            <p className="text-sm text-destructive">
              {errors.recaptchaToken.message as string}
            </p>
          )}
        </div>
      )}

      {/* Botão */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full gap-2 sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={16} />
            {isOuvidoria ? "Registrar manifestação" : "Enviar mensagem"}
          </>
        )}
      </Button>
    </form>
  );
}
