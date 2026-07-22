// types/subscription.ts — Tipagens dos endpoints de assinatura e checkout

/** Plano retornado pelo GET /plans */
export interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: FeaturesList[];
  highlighted: boolean;
  cta: string;
}

export interface FeaturesList {
  item: string;
}

/** Resposta do POST /checkout */
export interface CheckoutResponse {
  checkout_url: string;
}

/** Tipo de acesso do usuário no modelo híbrido */
export type AccessType = "recurring" | "fixed";

/** Resposta do GET /student/status */
export interface SubscriptionStatusResponse {
  is_active: boolean;
  access_type?: AccessType;
  access_expires_at?: string | null; // ISO 8601
  plan_name?: string | null;
  plan_price?: string | null;
  status?: "active" | "canceled" | "expired" | null;
  renews_at?: string | null; // ISO 8601 — só relevante para recurring
  member_since?: string | null; // ISO 8601
  payment_type: PaymentMethod;
}

// ── Checkout Transparente ───────────────────────────────────────────

/** Métodos de pagamento aceitos pelo checkout transparente */
export type PaymentMethod = "pix" | "credit_card" | "boleto" | "stripe";

/** Tipo de documento do comprador */
export type DocumentType = "cpf" | "cnpj";

/** Payload enviado ao POST /checkout/process */
export interface CheckoutProcessPayload {
  plan_id: number;
  name: string;
  email: string;
  document_type: DocumentType;
  document: string;
  phone: string;
  payment_method: PaymentMethod;
}

/** Respostas possíveis do POST /checkout/process */
export interface CheckoutProcessResponse {
  type: "redirect" | "pix" | "success" | "boleto";
  url?: string; // type=redirect (Stripe) ou type=boleto
  qr_code_base64?: string; // type=pix
  copy_paste_code?: string; // type=pix
  message?: string;
}
