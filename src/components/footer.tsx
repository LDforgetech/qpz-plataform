"use client";

import Logo from "@/components/logo";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground pt-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            A plataforma líder em capacitação de RH e treinamentos corporativos
            no Brasil.
          </p>
        </div>

        {[
          {
            title: "Plataforma",
            links: ["Cursos", "Trilhas", "Certificados", "Mentorias"],
          },
          {
            title: "Empresa",
            links: ["Sobre nós", "Blog", "Carreiras", "Contato"],
          },
          {
            title: "Suporte",
            links: ["Central de ajuda", "Termos de uso", "Privacidade", "FAQ"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link}
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
