import Link from "next/link";
import {
  FileText,
  Shield,
  UserCheck,
  CreditCard,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    id: "aceite",
    icon: UserCheck,
    title: "1. Aceitação dos Termos",
    content: [
      "Ao acessar e utilizar a plataforma CapitalHumano, você concorda em cumprir e estar vinculado a estes Termos de Uso e a todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.",
      "A CapitalHumano reserva-se o direito de alterar, modificar, adicionar ou remover partes destes termos a qualquer momento. Recomendamos que você os revise periodicamente. O uso continuado da plataforma após a publicação de alterações constitui aceitação das mudanças.",
    ],
  },
  {
    id: "cadastro",
    icon: FileText,
    title: "2. Cadastro e Conta",
    content: [
      "Para acessar os cursos e funcionalidades da plataforma, é necessário criar uma conta fornecendo informações precisas, completas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.",
      "A CapitalHumano se reserva o direito de suspender ou encerrar contas que apresentem informações falsas, uso indevido, compartilhamento de credenciais ou qualquer violação destes termos.",
    ],
  },
  {
    id: "acesso",
    icon: Shield,
    title: "3. Acesso e Licença de Uso",
    content: [
      "A CapitalHumano vende acesso por tempo determinado à plataforma, e não cursos individuais. O acesso é concedido mediante a contratação de um dos planos disponíveis e está condicionado ao pagamento das respectivas taxas.",
      "É concedida uma licença limitada, não exclusiva e intransferível para acessar e utilizar o conteúdo disponível na plataforma durante o período ativo de sua assinatura. O conteúdo é protegido por direitos autorais e não pode ser reproduzido, distribuído ou comercializado sem autorização.",
      "O download, gravação ou qualquer forma de captura não autorizada do conteúdo em vídeo, áudio ou texto é estritamente proibido e pode resultar em sanções legais.",
    ],
  },
  {
    id: "pagamento",
    icon: CreditCard,
    title: "4. Pagamento e Planos",
    content: [
      "Os planos de assinatura disponíveis estão descritos na página de planos da plataforma. O acesso aos cursos e recursos varia conforme o plano contratado.",
      "As cobranças são processadas de acordo com a periodicidade escolhida (mensal, trimestral ou anual). O não pagamento pode resultar na suspensão imediata do acesso até a regularização.",
      "O cancelamento pode ser solicitado a qualquer momento através da página de gerenciamento de plano. O acesso permanece ativo até o final do período pago.",
    ],
  },
  {
    id: "conduta",
    icon: AlertTriangle,
    title: "5. Conduta do Usuário",
    content: [
      "O usuário se compromete a utilizar a plataforma de forma ética, respeitosa e dentro da lei. É proibido:",
      "• Compartilhar credenciais de acesso com terceiros;",
      "• Utilizar a plataforma para fins ilegais ou não autorizados;",
      "• Tentar acessar áreas restritas, interferir na operação ou comprometer a segurança da plataforma;",
      "• Publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros nos espaços de interação.",
      "A violação destas regras pode resultar na suspensão ou encerramento permanente da conta, sem direito a reembolso.",
    ],
  },
  {
    id: "privacidade",
    icon: Shield,
    title: "6. Privacidade e Dados",
    content: [
      "A coleta e tratamento de dados pessoais estão regidos pela nossa Política de Privacidade. Ao utilizar a plataforma, você consente com a coleta e uso de informações conforme descrito na referida política.",
      "Os dados fornecidos no formulário de diagnóstico de perfil são utilizados exclusivamente para personalização da trilha de aprendizado e não são compartilhados com terceiros sem consentimento.",
    ],
  },
  {
    id: "disponibilidade",
    icon: HelpCircle,
    title: "7. Disponibilidade e Suporte",
    content: [
      "A CapitalHumano se esforça para manter a plataforma disponível de forma contínua, mas não garante acessibilidade ininterrupta. Manutenções programadas e eventuais indisponibilidades por questões técnicas podem ocorrer.",
      "O suporte ao usuário é prestado pelos canais informados na página de contato, em horário comercial. Nosso compromisso é responder em até 24 horas úteis.",
    ],
  },
  {
    id: "responsabilidade",
    icon: AlertTriangle,
    title: "8. Limitação de Responsabilidade",
    content: [
      "A CapitalHumano não se responsabiliza por interrupções de serviço causadas por fatores fora de seu controle, incluindo problemas de conectividade do usuário, falhas de provedores de internet ou eventos de força maior.",
      "O conteúdo dos cursos é oferecido com propósito educacional. Os resultados de aplicação no ambiente corporativo dependem de diversos fatores e não constituem garantia de performance ou resultados específicos.",
    ],
  },
  {
    id: "geral",
    icon: FileText,
    title: "9. Disposições Gerais",
    content: [
      "Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será dirimida no foro da comarca de São Paulo, SP.",
      "Caso qualquer disposição destes termos seja considerada inválida ou inexequível, as demais permanecerão em pleno vigor e efeito.",
      "Dúvidas sobre estes termos podem ser encaminhadas através da página de contato da plataforma.",
    ],
  },
];

const lastUpdated = "02 de julho de 2026";

export default function TermsPage() {
  return (
    <div>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <section className="relative overflow-hidden bg-primary py-14 md:py-18">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-80" />

          <div className="relative container mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                Documentos legais
              </span>

              <h1 className="mb-3 mt-3 text-3xl font-display font-bold text-primary-foreground md:text-4xl">
                Termos de Uso
              </h1>

              <p className="leading-relaxed text-primary-foreground/70">
                Condições e regras que regem o acesso e a utilização da
                plataforma CapitalHumano.
              </p>

              <p className="mt-4 text-sm text-primary-foreground/50">
                Última atualização: {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="leading-relaxed text-muted-foreground">
              Bem-vindo à CapitalHumano. Estes Termos de Uso estabelecem as
              regras e condições para utilização da nossa plataforma de cursos e
              treinamentos corporativos em Recursos Humanos. Leia atentamente
              antes de prosseguir.
            </p>

            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Card
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20 border-border/60"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon size={18} className="text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="mb-3 text-xl font-display font-semibold text-foreground">
                          {section.title}
                        </h2>

                        <div className="space-y-3">
                          {section.content.map((paragraph, index) => (
                            <p
                              key={`${section.id}-${index}`}
                              className="text-sm leading-relaxed text-muted-foreground"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="pb-8 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Dúvidas sobre os Termos de Uso?{" "}
                <Link
                  href="/contato"
                  className="font-medium text-primary hover:underline"
                >
                  Entre em contato conosco
                </Link>
                .
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
