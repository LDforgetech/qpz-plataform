import { z } from "zod";

// ── Schema base para formulários de suporte (Contato & Ouvidoria) ───
export const supportFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nome muito curto"),

  email: z
    .string()
    .email("E-mail inválido"),

  subject: z
    .string()
    .min(3, "Assunto muito curto"),

  message: z
    .string()
    .min(10, "Mensagem muito curta. Descreva com mais detalhes."),
});

// ── Schema estendido para Ouvidoria (inclui reCAPTCHA) ──────────────
export const ouvidoriaFormSchema = supportFormSchema.extend({
  recaptchaToken: z
    .string()
    .min(1, "Verificação reCAPTCHA obrigatória"),
});

// ── Tipos inferidos ─────────────────────────────────────────────────
export type SupportFormData = z.infer<typeof supportFormSchema>;
export type OuvidoriaFormData = z.infer<typeof ouvidoriaFormSchema>;

// Tipo de suporte aceito
export type SupportType = "contato" | "ouvidoria";
