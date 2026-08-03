"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const getCancelSchema = (paymentMethod: string) => {
  return z
    .object({
      confirmation: z.string().refine((val) => val === "CANCELAR" || "", {
        message: 'Você deve digitar "CANCELAR" para confirmar.',
      }),
      reason: z.string().optional(),
      details: z.string().optional(),
      pix_key: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (paymentMethod === "boleto" && !data.pix_key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pix_key"],
          message:
            "A chave PIX é obrigatória para estorno de compras via boleto.",
        });
      }
    });
};

type CancelSubscriptionDialogProps = {
  paymentMethod: "credit_card" | "boleto" | "pix" | string;
  children: React.ReactNode;
};

export function CancelSubscriptionDialog({
  paymentMethod,
  children,
}: CancelSubscriptionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const schema = React.useMemo(
    () => getCancelSchema(paymentMethod),
    [paymentMethod],
  );
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmation: "",
      reason: "",
      details: "",
      pix_key: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) =>
      api.post("subscription/cancel", data),
    onSuccess: () => {
      toast.success("Assinatura cancelada com sucesso.");
      setOpen(false);
      reset();
      router.refresh();
    },
    onError: (error: any) => {
      setOpen(false);
      if (error.status === 403 && error.error === "out_of_window") {
        toast.error("Prazo de reembolso expirado", {
          description:
            "O prazo de 7 dias para cancelamento com reembolso já passou.",
          action: {
            label: "Ler Política",
            onClick: () =>
              router.push("/termos-de-uso#politica-de-cancelamento"),
          },
          duration: 10000,
        });
      } else {
        toast.error("Ocorreu um erro ao cancelar a assinatura.", {
          description: "Por favor, tente novamente mais tarde.",
        });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja cancelar?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar o cancelamento, sua assinatura será encerrada e você
            perderá o acesso aos benefícios do plano de acordo com nossa
            política de cancelamento.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="cancel-subscription-form"
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do cancelamento (opcional)</Label>
              <select
                id="reason"
                className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 dark:bg-input/30 md:text-sm"
                {...register("reason")}
              >
                <option value="">Selecione um motivo...</option>
                <option value="too_expensive">Muito caro</option>
                <option value="not_using">Não estou usando</option>
                <option value="missing_features">
                  Faltam recursos que eu preciso
                </option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Detalhes adicionais (opcional)</Label>
              <Textarea
                id="details"
                placeholder="Conte-nos um pouco mais sobre sua decisão..."
                {...register("details")}
              />
            </div>

            {paymentMethod === "boleto" && (
              <div className="space-y-2 rounded-lg border border-amber-200/50 bg-amber-500/10 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <p className="mb-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  Como sua compra foi via boleto, precisamos de uma Chave PIX
                  vinculada ao seu CPF para processar o estorno manual.
                </p>
                <Label htmlFor="pix_key">
                  Chave PIX <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pix_key"
                  placeholder="E-mail, CPF, Telefone ou Chave Aleatória"
                  aria-invalid={!!errors.pix_key}
                  {...register("pix_key")}
                />
                {errors.pix_key && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.pix_key.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="confirmation">
                Para confirmar, digite{" "}
                <strong className="font-bold">CANCELAR</strong> abaixo:
              </Label>
              <Input
                id="confirmation"
                placeholder="CANCELAR"
                autoComplete="off"
                aria-invalid={!!errors.confirmation}
                {...register("confirmation")}
              />
              {errors.confirmation && (
                <p className="text-sm font-medium text-destructive">
                  {errors.confirmation.message}
                </p>
              )}
            </div>
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
          <Button
            type="submit"
            form="cancel-subscription-form"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Confirmar Cancelamento"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
