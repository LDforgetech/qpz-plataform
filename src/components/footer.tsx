import Logo from "@/components/logo";

const dataRoutes = [
  {
    title: "Empresa",
    links: [{ label: "Sobre nós", href: "https://quatropontozero.com.br/" }],
  },
  {
    title: "Redes",
    links: [
      {
        label: "Linkedin",
        href: "https://www.linkedin.com/company/quatropontozero-rh/",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/quatropontozero_rh?igsh=Z2FqcDByMmV3ejg1",
      },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Termos de uso", href: "termos-e-condicoes" },
      { label: "Política de Privacidade", href: "politicas-de-privacidade" },
      { label: "Ouvidoria", href: "ouvidoria" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-primary text-primary-foreground pt-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="bg-white/10 p-4 rounded-2xl mb-4">
            <Logo />
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            A plataforma líder em capacitação de RH e treinamentos corporativos
            no Brasil.
          </p>
        </div>

        {dataRoutes.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.title != "Redes"
                ? col.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))
                : col.links.map((link, i) => (
                    <li key={i}>
                      <a
                        target="_blank"
                        href={link.href}
                        className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 py-4 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} CapitalHumano. Todos os direitos
        reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
