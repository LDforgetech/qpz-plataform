import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CheckoutResponse } from "@/types/subscription";

/**
 * POST /checkout — Cria uma sessão de checkout no Stripe e redireciona.
 * Utilizado tanto no fluxo inicial de compra quanto na renovação de
 * acesso fixo (modelo híbrido).
 */
export function useCheckout() {
  return useMutation<CheckoutResponse, Error, { plan_id: number }>({
    mutationFn: (payload) =>
      api.post<CheckoutResponse>("checkout/process", payload),
    onSuccess: (data) => {
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
  });
}
