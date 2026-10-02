import Link from "next/link";
import {
  UserCheck,
  HandCoins,
  Info,
  Handshake,
  PcCase,
  Cookie,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";

/* ── Content types ── */
type TextItem = {
  type: "text";
  value: string;
};

type SubtitleItem = {
  type: "subtitle";
  title: string;
  /** Optional paragraph right after the subtitle */
  value?: string;
};

type ListItem = {
  type: "list";
  items: Array<{
    /** Optional bold label before the text (e.g. "Tópico 1") */
    label?: string;
    text: string;
  }>;
};

type ContentItem = TextItem | SubtitleItem | ListItem;

type Section = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: ContentItem[];
};

/* ── Sections data ── */

const sections: Section[] = [
  {
    id: "aceite",
    icon: UserCheck,
    title: "1. Conta Pessoal",
    content: [
      {
        type: "text",
        value: "1.1 Você precisará se registrar para ter acesso a plataforma.",
      },
      {
        type: "text",
        value:
          "1.2 Você precisará fornecer através do nosso formulário informações completas e precisas, incluindo um endereço de e-mail válido.",
      },
      {
        type: "text",
        value:
          "1.3 Você será completamente responsável por sua conta, incluindo quaisquer danos ou prejuízos causados por alguém que utilize sua conta sem autorização.",
      },
      {
        type: "text",
        value: "1.4 Sua conta é de uso pessoal e intransferível.",
      },
      {
        type: "text",
        value:
          "1.5 Caso desconfie que outra pessoa esteja usando sua conta, você deverá entrar em contato imediatamente através do e-mail contato@plataforma.quatropontozero.com.br (ou se suspeitar de qualquer outra violação de segurança).",
      },
      {
        type: "text",
        value:
          "1.6 Caso necessário, você precisará fornecer algumas informações para que possamos confirmar que é, de fato, a sua da conta.",
      },
    ],
  },
  {
    id: "assinatura",
    icon: Handshake,
    title: "2. Assinatura e Licença",
    content: [
      {
        type: "text",
        value:
          "2.1 Ao registrar-se na ElevareQPZ, a pessoa receberá uma licença pelo tempo escolhido no ato da inscrição, concedendo acesso e visualização dos cursos através da nossa plataforma online.",
      },
      {
        type: "text",
        value:
          "2.2 Os cursos são licenciados, e não vendidos. A licença não confere nenhum direito de revender o curso por nenhum meio (inclusive por compartilhamento das informações da conta com um comprador ou por download ilegal do curso e compartilhamento do curso em sites de torrent ou sites de armazenamento na nuvem como Google Drive, OneDrive, etc.)",
      },
      {
        type: "text",
        value:
          "2.3 Em termos legais e mais abrangentes, a ElevareQPZ concede uma licença limitada e intransferível para acessar e visualizar os cursos e conteúdos associados cuja assinatura necessária tenha sido paga, exclusivamente para fins pessoais, educacionais e não comerciais. Todas as outras formas de uso são expressamente proibidas. É proibido reproduzir, redistribuir, transmitir, ceder, vender, transmitir por rádio ou televisão, alugar, compartilhar, emprestar, modificar, adaptar, editar, criar obras derivadas, sublicenciar ou de qualquer outra forma transferir qualquer curso. Essa condição se aplica também a qualquer conteúdo que possa ser acessado por meio de qualquer uma de nossas APIs.",
      },
      {
        type: "text",
        value:
          "2.4 O Plano Vitalício concede uma licença de acesso vitalício. No entanto, reservamo-nos o direito de revogar qualquer licença de acesso e uso dos cursos caso seja identificada infração destes Termos pela conta.",
      },
    ],
  },
  {
    id: "pagamento",
    icon: HandCoins,
    title: "3. Política de Pagamentos e Reembolso",
    content: [
      {
        type: "text",
        value:
          "3.1 A pessoa concorda em não usar nenhum meio de pagamento inválido, não autorizado ou fraudulento.",
      },
      {
        type: "subtitle",
        title: "3.2 Formas de pagamento:",
        value:
          "3.2.1 A pessoa concorda em não usar nenhum meio de pagamento inválido, não autorizado ou fraudulento.",
      },
      {
        type: "text",
        value:
          "3.2.2 No momento da compra a pessoa deverá escolher a forma de pagamento mais adequada, entre elas a ElevareQPZ disponibiliza o intermediador AbacatePay. Estes intermediador oferece diversas formas de pagamento e parcelamento.",
      },
      {
        type: "subtitle",
        title: "3.3 Parcelamento:",
        value:
          "3.3.1 A ElevareQPZ oferece parcelamento em até 12x sem juros dos planos.",
      },
      {
        type: "text",
        value:
          "3.3.3 Quaisquer reclamações ou consultas relacionadas a pagamento através de qualquer intermediador deverá ser feita diretamente com o intermediador ou com operadora de cartão de crédito.",
      },
      {
        type: "subtitle",
        title: "3.4 Prazos e aprovação:",
        value:
          "3.4.1 Para compras feitas através de boleto bancário, o prazo para compensação é de até 3 (três) dias úteis, por conta da compensação bancária.",
      },
      {
        type: "text",
        value:
          "3.4.2 Para compras feitas pelo cartão de crédito através do intermediador, o prazo será variável de acordo com os termos dos intermediadores e prazos vigentes das empresas de cartão de crédito.",
      },
      {
        type: "text",
        value:
          "3.4.3 Os cursos online são liberados para acesso mediante a comprovação do pagamento efetuado pelos meios já citados acima.",
      },
      {
        type: "text",
        value:
          "3.4.4 Para pagamentos através do intermediador AbacatePay, a liberação do curso é automática e depende da aprovação da transação pelo próprio intermediador. Assim que uma compra é aprovada pelo AbacatePay, o mesmo retorna o status de aprovado para nosso sistema que automaticamente libera o curso na conta da pessoa.",
      },
      {
        type: "subtitle",
        title: "3.5 Termos dos intermediadores:",
        value:
          "3.5.1 Optando por pagamento através de um intermediador, a pessoa é responsável pelo cumprimento das cláusulas contratuais vigentes pelo intermediador, não sendo a ElevareQPZ responsável por aprovação, cancelamento ou consultas relativas às transações entre o cliente, o intermediador e a empresa de cartão de crédito ou instituição bancária.",
      },
      {
        type: "subtitle",
        title: "3.6 Cancelamento e Reembolso:",
        value:
          "3.6.1 A compra poderá ser cancelada no prazo máximo de 7 (sete) dias a partir da data de aprovação do pedido. Uma solicitação formal deverá ser feita através do e-mail: contato@plataforma.quatropontozero.com.br, informando os motivos pelo cancelamento. Após o prazo de 7 (sete) dias não é possível cancelar a compra.",
      },
      {
        type: "text",
        value:
          "3.6.2 A compra poderá ser cancelada no prazo máximo de 7 (sete) dias a partir da data de aprovação do pedido. Uma solicitação formal deverá ser feita através do e-mail: contato@plataforma.quatropontozero.com.br, informando os motivos pelo cancelamento. Após o prazo de 7 (sete) dias não é possível cancelar a compra.",
      },
      {
        type: "text",
        value:
          "3.6.3 O reembolso de recursos de compras duplicadas ou devolução por desistência deve ser solicitado pelo cliente. O reembolso para pagamentos provenientes do intermediador é feito pela equipe da ElevareQPZ através do próprio intermediador e a devolução do valor integral ocorre como crédito nas próximas faturas do cliente. Para pagamentos feitos via boleto bancário, a devolução é feita através de depósito ou transferência na conta corrente do cliente em um prazo de até 15 dias úteis após solicitação.",
      },
      {
        type: "text",
        value:
          "3.6.4 Se acreditarmos que o cliente esteja abusando de nossa política de reembolso, como no caso de já ter consumido uma parte significativa de um curso, reservamo-nos o direito de recusar esse reembolso, banir a conta desse usuário e/ou restringir qualquer uso futuro da Plataforma. Se banirmos sua conta ou desativarmos seu acesso em virtude de violação destes Termos, o usuário não terá direito a reembolso.",
      },
    ],
  },
  {
    id: "informacoes",
    icon: Info,
    title: "4. Informações Essenciais",
    content: [
      {
        type: "subtitle",
        title: "4.1 Informações sobre os cursos:",
        value:
          "4.1.1 É de responsabilidade do cliente, antes da aquisição dos cursos, a conferência de seu conteúdo disponível na página do curso. Também é de responsabilidade do cliente a conferência dos pré-requisitos dos cursos.",
      },
      {
        type: "text",
        value:
          "4.1.2 Os cursos ficam disponíveis na conta do cliente em nossa plataforma online pelo período contratado.",
      },
      {
        type: "text",
        value:
          "4.1.3 O cliente poderá assistir aos vídeos e ler os conteúdos de seus cursos adquiridos quantas vezes quiser durante o período contratado.",
      },
      {
        type: "text",
        value:
          "4.1.4 O cliente poderá tirar dúvidas com o tutor do curso através do e-mail contato@plataforma.quatropontozero.com. O suporte ao curso é garantido de acordo com o período contratado.",
      },
      {
        type: "subtitle",
        title: "4.2 Suporte:",
        value: "4.2.1 O único canal oficial de suporte é através do e-mail.",
      },
      {
        type: "text",
        value:
          "4.2.2 As dúvidas serão respondidas em um prazo mínimo de 72h, contudo este prazo poderá variar de acordo com a complexidade da dúvida postada pelo cliente. Aceitando esses termos, o cliente estará ciente de que não existe um prazo máximo para resposta das dúvidas.",
      },
      {
        type: "text",
        value:
          "4.2.3 As dúvidas devem estar relacionadas ao conteúdo dos cursos. O envio das mesmas deve conter o máximo de detalhes possíveis, como descrição completa de erros e links dos sites para que o tutor possa prestar o devido suporte de forma eficaz.",
      },
      {
        type: "text",
        value:
          "4.2.4 O suporte da ElevareQPZ sente-se no direito de não prestar o suporte caso a dúvida não esteja relacionada com a plataforma.",
      },
      {
        type: "subtitle",
        title: "4.3 Versão dos softwares:",
        value:
          "4.3.1 O cliente deverá usar os softwares nas mesmas versões ensinadas nos cursos. É de responsabilidade do cliente conferir as versões de cada software ensinado na página do curso. A ElevareQPZ sente-se no direito de não prestar o suporte caso o cliente esteja usando uma versão de software diferente das usadas nos cursos.",
      },
      {
        type: "text",
        value:
          "4.3.2 É necessário um computador com Windows 10, Mac OS 10.11 ou Ubuntu para assistir as aulas. No caso de Ubuntu substituições de softwares serão indicadas pelo professor.",
      },
      {
        type: "subtitle",
        title: "4.7 Recursos Externos",
        value:
          "O cliente poderá encontrar links para outros sites e/ou Plugins que não nos pertencem nem controlamos. Não nos responsabilizamos pelo conteúdo nem por nenhum outro aspecto de sites de terceiros, sua disponibilidade, preços praticados, mudança de comportamento após período que foi utilizado em aula, inclusive pelas informações por eles coletadas sobre o usuário. Recomenda-se que o usuário leia também os termos e condições e políticas de privacidade desses sites.",
      },
      {
        type: "subtitle",
        title: "4.8 Certificado:",
        value:
          "O certificado de conclusão do curso é emitido online e fica disponível na conta do usuário após concluir 100% do curso. Certificados não serão emitidos para clientes que não completarem os cursos.",
      },
    ],
  },
  {
    id: "direitos",
    icon: Cookie,
    title: "5. Privacidade e Dados",
    content: [
      {
        type: "text",
        value:
          "5.1 A ElevareQPZ é proprietária da plataforma e seus Serviços, bem como itens tais como logotipos, API, códigos e conteúdo criados pela própria. É proibido adulterá-los ou usá-los sem autorização.",
      },
      {
        type: "text",
        value:
          "5.2 Todos os direitos, títulos e participações referentes à plataforma, serviços da ElevareQPZ e bancos de dados são e continuarão sendo propriedade exclusiva da ElevareQPZ.",
      },
      {
        type: "text",
        value:
          "5.3 Nossa plataforma e serviços são protegidos pelas leis de direitos autorais, marcas comerciais e outras leis nacionais. Nada concederá ao usuário o direito de usar o nome da (noma da plataforma) ou de qualquer uma das marcas comerciais, logotipos, nomes de domínio e outras características distintivas da marca ElevareQPZ.",
      },
      {
        type: "text",
        value:
          "5.4 Qualquer feedback ou comentário que, por ventura, seja fornecido pelo usuário sobre a ElevareQPZ é totalmente voluntário. A ElevareQPZ terá a liberdade de usar qualquer feedback ou comentário que julgue conveniente, sem obrigação sobre o usuário.",
      },
      {
        type: "text",
        value:
          "5.5 Ao acessar ou usar a plataforma ou os Serviços da ElevareQPZ, é proibido:",
      },
      {
        type: "list",
        items: [
          {
            text: "acessar, adulterar ou usar áreas não públicas da plataforma (inclusive armazenamento de conteúdo), sistemas informáticos da ElevareQPZ ou sistemas de entrega técnica dos provedores de serviços da ElevareQPZ",
          },
          {
            text: "desativar, interferir em ou tentar burlar qualquer recurso da plataforma relacionado a segurança ou investigar, verificar ou testar a vulnerabilidade de qualquer um dos nossos sistemas.",
          },
          {
            text: "copiar, modificar, criar obras derivadas, praticar engenharia reversa, praticar montagem reversa ou, de alguma forma, tentar decifrar qualquer código-fonte ou conteúdo da plataforma ou dos Serviços da ElevareQPZ.",
          },
          {
            text: "acessar, pesquisar ou tentar acessar ou pesquisar nossa plataforma por qualquer meio (automatizado ou não). É proibido usar meios de scrape, spider, robôs ou outros meios automatizados, de qualquer tipo, para acessar os Serviços.",
          },
          {
            text: "de alguma forma, usar os Serviços para enviar informações de identificação da origem alteradas, enganosas ou falsas (como o envio de comunicações por e-mail que pareçam falsamente ser da ElevareQPZ); ou interferir no acesso, ou interrompê-lo (ou tentar fazê-lo), de qualquer usuário, host ou rede, inclusive, entre outros, o envio de vírus, sobrecarga, flooding, spam ou bombardeios de e-mail nas plataformas ou serviços, ou de alguma forma interferir ou criar uma carga indevida sobre os Serviços.",
          },
        ],
      },
      {
        type: "text",
        value:
          "5.6 Os cursos online possuem um bloqueio para download podendo ser visualizados apenas dentro da plataforma de ensino da ElevareQPZ.",
      },
      {
        type: "text",
        value:
          "5.7 É de inteira responsabilidade do cliente que adquiriu o curso de NÃO propagar o seu conteúdo sob pena de Processo Civil contido na lei nº ‘781278’12786’1 do artigo penal 12318231809.",
      },
      {
        type: "text",
        value:
          "5.8 A propagação do conteúdo resultará no bloqueio imediato da conta, sem a devolução do valor pago. A verificação do responsável pela propagação será feita através da assinatura digital dos arquivos baixados.",
      },
      {
        type: "text",
        value:
          "5.9 A conta não pode ser compartilhada com outras pessoas, o compartilhamento da mesma pode ocasionar no banimento da conta.",
      },
      {
        type: "text",
        value:
          "5.12 A conta não pode ser compartilhada com outras pessoas, o compartilhamento da mesma pode ocasionar no banimento da conta.",
      },
    ],
  },
  {
    id: "obrigatoriedade",
    icon: PcCase,
    title: "6. Obrigatoriedade Contratual",
    content: [
      {
        type: "text",
        value:
          "6.1 O cliente concorda que, ao se cadastrar, acessar ou usar nossa Plataforma, aceita firmar um contrato jurídico com a ElevareQPZ.",
      },
      {
        type: "text",
        value:
          "6.2 Caso não concorde com estes Termos, o usuário não deverá se cadastrar, acessar ou usar nenhum de nossos Serviços.",
      },
    ],
  },
];

/* ── Content renderer ── */
function SectionContent({
  sectionId,
  content,
}: {
  sectionId: string;
  content: ContentItem[];
}) {
  return (
    <div className="space-y-3">
      {content.map((item, index) => {
        const key = `${sectionId}-${index}`;

        switch (item.type) {
          case "text":
            return (
              <p
                key={key}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {item.value}
              </p>
            );

          case "subtitle":
            return (
              <div key={key} className="pt-2">
                <h3 className="mb-1.5 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                {item.value && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.value}
                  </p>
                )}
              </div>
            );

          case "list":
            return (
              <ul
                key={key}
                className="space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground"
              >
                {item.items.map((li, liIdx) => (
                  <li
                    key={`${key}-li-${liIdx}`}
                    className="relative pl-3 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground"
                  >
                    {li.label ? (
                      <>
                        <span className="font-medium text-foreground">
                          {li.label}:
                        </span>{" "}
                        {li.text}
                      </>
                    ) : (
                      li.text
                    )}
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}

const lastUpdated = "22 de julho de 2026";

export default function TermsPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-background pt-16">
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
                Condições e regras que regem o acesso e a utilização da (nome da
                plataforma).
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
              Bem-vindo à ElevareQPZ. Estes Termos de Uso estabelecem as regras
              e condições para utilização da nossa plataforma de cursos e
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

                        <SectionContent
                          sectionId={section.id}
                          content={section.content}
                        />
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
      <Footer />
    </div>
  );
}
