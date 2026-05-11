import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // 1. Proteção de Autenticação (Garantia adicional ao middleware)
  if (!userId) {
    redirect("/");
  }

  // 2. GATILHO PARA INTEGRAÇÃO DE PAGAMENTO
  // TODO: Quando integrar o seu gateway de pagamento (Stripe, Pagar.me, Mercado Pago, etc),
  // você deverá verificar aqui se o usuário possui acesso ativo.
  // Isso pode ser feito lendo o `publicMetadata` do Clerk ou fazendo uma query no seu banco de dados.

  // Exemplo de como poderia ser a verificação no futuro:
  // const userHasAccess = sessionClaims?.metadata?.hasPaid === true;

  // Por enquanto, como não há pagamento integrado, deixamos como 'true' para liberar o acesso.
  const userHasAccess = true; // <-- Quando tiver a integração, substitua pela sua lógica real.

  if (!userHasAccess) {
    // Se não comprou, redireciona para a página de vendas ou planos.
    redirect("/#planos");
  }

  return <>{children}</>;
}
