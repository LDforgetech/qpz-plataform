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
  value?: string;
};

type ListItem = {
  type: "list";
  items: Array<{
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
    id: "coleta",
    icon: UserCheck,
    title: "1. Coleta de Dados",
    content: [
      {
        type: "text",
        value:
          "Coletamos alguns dados do usuário de forma direta, como informações inseridas pelo próprio usuário em nossos formulários e de forma automatizada, tais como informações sobre o dispositivo do usuário e com quais páginas do nosso site o usuário interage ou utiliza.",
      },
      {
        type: "subtitle",
        title: "1.1 Dados coletados diretamente:",
        value:
          "Quando o usuário se registra através do nosso formulário e acessa nossa plataforma coletamos todos os dados fornecidos diretamente, entre eles:",
      },
      {
        type: "list",
        items: [
          {
            text: "Dados da conta: Para usar determinados recursos (como assinar um Plano), é necessário criar uma conta de usuário. Quando o usuário cria ou atualiza sua conta, coletamos e armazenamos os dados fornecidos, como nome completo, endereço físico, endereço de e-mail, senha e atribuímos ao usuário um número de identificação exclusivo (“Dados da conta”).",
          },
          {
            text: "Dados dos cursos: Quando o usuário assina um Plano, coletamos alguns dados, como quais cursos foram iniciados e concluídos pelo usuário.",
          },
          {
            text: "Dados sobre pagamento dos usuários: Quando o usuário assina um Plano, coletamos alguns dados sobre a compra em questão (tais como nome e CEP do usuário) quando necessário para processar o pedido. Cabe ao usuário fornecer determinados dados sobre pagamento e fatura diretamente aos nossos parceiros de processamento de pagamentos, entre eles nome do usuário, informações sobre o cartão de crédito, endereço de faturamento e CEP. Por questões de segurança, a ElevareQPZ não coleta nem armazena dados confidenciais do titular do cartão, tais como o número completo do cartão de crédito ou os dados de autenticação do cartão.",
          },
          {
            text: "Comunicações e suporte: Caso o usuário entre em contato para obter suporte ou relatar um problema ou dúvida (independentemente de ter criado uma conta), coletamos e armazenamos as informações de contato do usuário, bem como mensagens e outros dados sobre o usuário, tais como nome, endereço de e-mail, localização, sistema operacional, endereço IP e quaisquer outros dados que o usuário forneça ou que coletemos por meios automatizados (abordados abaixo). Estes dados serão usados para responder ao usuário e pesquisar sobre a dúvida apresentada, de acordo com esta Política de Privacidade.",
          },
        ],
      },
      {
        type: "subtitle",
        title: "1.2 Dados coletados automaticamente:",
        value:
          "Quando o usuário acessa o site coletamos determinados dados por meios automatizados, tais como:",
      },
      {
        type: "list",
        items: [
          {
            text: "Dados do sistema: Dados técnicos sobre o computador ou dispositivo do usuário, tais como endereço de IP, tipo de dispositivo, tipo e versão do sistema operacional, identificadores exclusivos do dispositivo, navegador, idioma do navegador, domínio e outros dados de sistemas e tipos de plataforma (“Dados do sistema”).",
          },
          {
            text: "Dados sobre a utilização: Estatísticas de uso sobre as interações do usuário com os site, tais como cursos acessados, tempo gasto nas páginas, páginas visitadas, recursos utilizados, dados sobre os cliques, data e hora e outros dados relacionados ao uso dos Serviços (“Dados de uso”) por parte do usuário.",
          },
          {
            text: "Dados geográficos aproximados: Localização geográfica aproximada, que inclui informações tais como país, cidade e coordenadas geográficas, calculada com base no endereço IP do usuário.",
          },
        ],
      },
      {
        type: "text",
        value:
          "Os dados listados acima são coletados por meio de arquivos de log do servidor e tecnologias de rastreamento.",
      },
      {
        type: "text",
        value:
          "Os dados são armazenados pela ElevareQPZ e associados à conta do usuário.",
      },
    ],
  },
  {
    id: "forma",
    icon: Handshake,
    title: "2. Forma de coleta dos dados:",
    content: [
      {
        type: "text",
        value:
          "Usamos cookies, serviços de análise e pixels de provedores de publicidade para reunir os dados citados.",
      },
      {
        type: "text",
        value:
          "Algumas dessas ferramentas oferecem ao usuário a possibilidade de optar por não permitir a coleta de dados.",
      },
      {
        type: "subtitle",
        title: "2.1 Cookies e ferramentas de coleta automatizadas",
        value:
          "A ElevareQPZ e os provedores de serviços que atuam em nome da ElevareQPZ (como o Google Analytics e anunciantes parceiros) usam cookies, tags, scripts, links personalizados, rastros de dispositivos ou navegadores para coleta automatizada de dados (coletivamente, “Ferramentas de coleta de dados”), quando o usuário acessa e usa o site.",
      },
      {
        type: "text",
        value:
          "Utilizamos cookies (pequenos arquivos que os sites enviam ao dispositivo do usuário para identificar, de forma exclusiva, o navegador ou dispositivo do usuário ou para armazenar dados no navegador do usuário) para analisar o uso do site, personalizar a experiência do usuário, aprimorar a performance do site e reconhecer o usuário quando ele retornar. Usamos pixels (scripts que nos permitem medir as ações dos visitantes e usuários que utilizam o site) para identificar se uma página foi visitada e fazer anúncios de forma direcionada, excluindo usuários atuais de determinadas campanhas promocionais.",
      },
      {
        type: "text",
        value: "A ElevareQPZ usa os seguintes tipos de cookies:",
      },
      {
        type: "list",
        items: [
          {
            text: "Preferências: cookies que lembram dados sobre o navegador e as configurações preferenciais do usuário que afetam a aparência e o comportamento do site.",
          },
          {
            text: "Segurança: cookies usadas para permitir que o usuário se conecte e acesse o site, proteger contra acessos fraudulentos e ajudar a detectar e impedir abuso ou uso não autorizado da conta do usuário.",
          },
          {
            text: "Funcional: cookies que armazenam configurações funcionais (como o número de aulas completadas).",
          },
          {
            text: "Estado da sessão: cookies que rastreiam as interações do usuário com o site para nos ajudar a melhorar o site e a experiência de navegação do usuário, lembrar os detalhes de acesso do usuário e permitir o processamento das compras de Planos. Estas são estritamente necessárias para que o site funcione corretamente. Portanto, se o usuário as desativar, certos recursos não funcionarão ou ficarão indisponíveis.",
          },
        ],
      },
      {
        type: "text",
        value:
          "Alguns parceiros terceirizados que fornecem determinados recursos em nosso site podem também usar objetos de armazenamento local para coletar e armazenar dados.",
      },
    ],
  },
  {
    id: "pagamento",
    icon: HandCoins,
    title: "3. Finalidade dos dados",
    content: [
      {
        type: "text",
        value:
          "Usamos os dados do usuário para fins tais como fornecer nossos serviços, nos comunicarmos com o usuário, solucionar problemas, proteger contra fraude e abuso, analisar como as pessoas usam nossos site, veicular publicidade personalizada, conforme exigido por lei ou necessário para a segurança.",
      },
      {
        type: "subtitle",
        title: "3.1 Funcionalidade e Manutenção da Plataforma",
        value:
          "Os dados colhidos quando o usuário utiliza o site são usados para:",
      },
      {
        type: "list",
        items: [
          {
            text: "Processar compras de Planos feitas pelo usuário;",
          },
          {
            text: "Fornecer e administrar os serviços através da nossa Plataforma;",
          },
          {
            text: "Enviar mensagens e notificações administrativas;",
          },
          {
            text: "Prestar suporte ao usuário;",
          },
          {
            text: "Enviar informações sobre novos cursos e promoções;",
          },
          {
            text: "Gerenciar as preferência da conta do usuário;",
          },
          {
            text: "Emissão de Certificados de Conclusão;",
          },
          {
            text: "Proteção do site e prevenção de fraudes e abusos;",
          },
        ],
      },
    ],
  },
  {
    id: "compartilhamento",
    icon: Info,
    title: "4. Compartilhamento de Dados do Usuário",
    content: [
      {
        type: "text",
        value:
          "Compartilhamos alguns dados sobre o usuário com empresas que prestam serviços para a (noma da plataforma), provedores de análise e empresas de publicidade que nos ajudam a promover nossa Plataforma. Poderemos também compartilhar os dados do usuário, conforme necessário, para fins de segurança, conformidade legal ou como parte de uma reestruturação corporativa.",
      },
      {
        type: "text",
        value:
          "Poderemos compartilhar os dados do usuário com terceiros nas seguintes circunstâncias:",
      },
      {
        type: "list",
        items: [
          {
            text: "Com prestadores de serviços, contratados e representantes: Compartilhamos os dados do usuário com empresas terceirizadas que prestam serviços para nossa Empresa, tais como processamento de pagamentos, análise de dados, serviços de marketing e publicidade (inclusive publicidade redirecionada), serviços de e-mail e hospedagem e atendimento e suporte ao cliente. Estes provedores de serviços podem acessar os dados pessoais do usuário e são obrigados a usá-los somente conforme orientados pela ElevareQPZ, para fornecer o serviço solicitado.",
          },
          {
            text: "Com serviços de análise de dados: Como parte do uso que fazemos de ferramentas de análise de terceiros, como o Google Analytics, compartilhamos algumas informações de contato, dados da conta, dados do sistema, dados sobre utilização ou dados não identificados, conforme necessário. Dados não identificados significam dados dos quais foram removidas informações, tais como o nome e o endereço de e-mail do usuário, que são substituídas por um ID de token. Desta forma, os provedores podem fornecer serviços de análise ou combinar os dados do usuário com informações de bancos de dados disponíveis publicamente (inclusive informações de contato e sociais provenientes de outras fontes). O objetivo é nos comunicarmos com o usuário de maneira mais eficaz e personalizada.",
          },
          {
            text: "Para publicidade: Poderemos usar e compartilhar certos dados do sistema e dados sobre utilização com anunciantes e redes de terceiros para exibir informações demográficas e preferenciais gerais entre nossos usuários. Poderemos, também, permitir que anunciantes coletem dados do sistema por meio de ferramentas de coleta de dados e usem esses dados para oferecer anúncios direcionados a fim de personalizar a experiência do usuário (por meio de publicidade segmentada). Os anunciantes poderão também compartilhar conosco os dados que coletarem sobre o usuário. Vale ressaltar que, ao optar por não participar, o usuário continuará a receber anúncios genéricos.",
          },
          {
            text: "Para segurança e conformidade com a lei: Poderemos divulgar os dados do usuário a terceiros se (a nosso exclusivo critério) acreditarmos, pautados na boa-fé, que a divulgação seja:",
          },
          {
            text: "Justificadamente necessária para aplicar nossos Termos de Uso, Política de Privacidade e outros acordos jurídicos;",
          },
          {
            text: "Necessária para detectar, prevenir ou solucionar casos de fraude, abuso, uso indevido, possíveis violações da lei ou questões técnicas ou de segurança; ou",
          },
          {
            text: "Para proteger contra danos iminentes aos direitos, propriedades ou seguranças da ElevareQPZ;",
          },
          {
            text: "Poderemos também divulgar dados sobre o usuário para nossos advogados e consultores jurídicos, a fim de avaliar nossas obrigações e direitos de divulgação ao abrigo desta Política de Privacidade.",
          },
        ],
      },
    ],
  },
  {
    id: "seguranca",
    icon: Cookie,
    title: "5. Segurança",
    content: [
      {
        type: "text",
        value:
          "Adotamos medidas de segurança adequadas para nos proteger contra acesso não autorizado, alteração, divulgação ou destruição dos dados pessoais do usuário por nós coletados e armazenados. Essas medidas variam com base no tipo e na confidencialidade dos dados. Infelizmente, no entanto, nenhum sistema pode ser 100% protegido. Por isso, não podemos garantir que as comunicações entre o usuário e a ElevareQPZ ou qualquer informação fornecida à ElevareQPZ em relação aos dados por nós coletados por meio do site estejam livres de acesso não autorizado por terceiros. A senha do usuário é uma parte importante do nosso sistema de segurança, e é responsabilidade do usuário protegê-la. Não compartilhe a senha com terceiros. Em caso de suspeita de violação da senha ou conta, altere-a imediatamente e entre em contato com conosco para sanar a situação.",
      },
    ],
  },
  {
    id: "direitos",
    icon: PcCase,
    title: "6. Direitos dos usuários",
    content: [
      {
        type: "text",
        value:
          "O usuário possui certos direitos quanto ao uso de seus dados, inclusive a possibilidade de optar por não receber e-mails promocionais, cookies e a coleta de dados por determinados provedores de serviços de análise. O usuário poderá atualizar ou encerrar sua conta dentro dos nosso site e, também, entrar em contato conosco para esclarecer dúvidas quanto a direitos individuais sobre seus dados pessoais",
      },
      {
        type: "subtitle",
        title: "6.1 Opções quanto ao uso de seus dados",
        value: "",
      },
      {
        type: "list",
        items: [
          {
            text: "O usuário pode optar por não fornecer determinados dados à ElevareQPZ, mas é possível que não consiga usar determinados recursos do site.",
          },
          {
            text: "O navegador ou dispositivo utilizado pelo usuário pode permitir o controle de cookies e outros tipos de armazenamento local de dados. Dispositivos sem fio podem também permitir o controle da coleta e do compartilhamento da localização ou de outros dados.",
          },
        ],
      },
      {
        type: "subtitle",
        title: "6.2 Acesso, manutenção e exclusão de dados",
        value:
          "Para acessar e atualizar os dados pessoais coletados e mantidos pela ElevareQPZ, o usuário pode:",
      },
      {
        type: "list",
        items: [
          {
            text: "Para atualizar dados fornecidos diretamente, o usuário deve conectar-se à sua conta e atualizá-la quando necessário.",
          },
          {
            text: "Para garantir a integridade dos certificados fornecidos aos usuários, o nome associado a conta e o email só podem ser modificados pelo administrador do site.",
          },
          {
            text: "Observação: Mesmo depois de encerrada a conta, reteremos os dados do usuário enquanto tivermos um propósito legítimo para assim o fazer, inclusive para ajudar em obrigações legais, resolver conflitos e fazer cumprir nossos contratos. Poderemos reter e divulgar esses dados de acordo com esta Política de Privacidade depois do encerramento da conta do usuário.",
          },
          {
            text: "Para solicitar acesso, corrigir ou excluir dados pessoais, entre em contato pelo nosso formulário de contato. Aguarde até 72 horas para obter uma resposta. Por questão de proteção do usuário, poderemos pedir que a solicitação seja enviada pelo endereço de e-mail associado à conta do usuário. Pode ser necessário confirmar a identidade do usuário antes de implementar a solicitação. Vale ressaltar que retemos certos dados quando temos direito de assim o fazer, inclusive em caso de manutenção obrigatória de registros e para realizar transações.",
          },
        ],
      },
      {
        type: "text",
        value:
          "Ao utilizar nossos serviços, o usuário concorda com os termos desta Política de Privacidade.",
      },
      {
        type: "text",
        value:
          "Não use os Serviços caso não concorde com esta Política de Privacidade.",
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
            <div className="max-w-4xl">
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                Documentos legais
              </span>

              <h1 className="mb-3 mt-3 text-3xl font-display font-bold text-primary-foreground md:text-4xl">
                Política de Privacidade
              </h1>

              <p className="leading-relaxed text-primary-foreground/70">
                Esta Política de Privacidade sumariza nossas práticas de coleta
                e tratamento de dados e descreve os direitos do usuário de
                acessar, corrigir ou limitar o uso de seus dados pessoais por
                parte da ElevareQPZ.
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
              Esta Política de Privacidade se aplica quando o usuário visita ou
              usa o site.
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
