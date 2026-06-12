"use client";

import * as React from "react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  SparklesIcon,
  AwardIcon,
  BookUserIcon,
  GraduationCapIcon,
} from "lucide-react";
import Logo from "@/components/logo";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Início",
      url: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      name: "Minha Trilha",
      url: "/minha-trilha",
      icon: <SparklesIcon />,
    },
    {
      name: "Certificados",
      url: "/certificados",
      icon: <AwardIcon />,
    },
    {
      name: "Contato",
      url: "/contato",
      icon: <BookUserIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="group-data-[collapsible=icon]:bg-transparent bg-accent/10 rounded-md p-4 flex items-center justify-center group-data-[collapsible=icon]:p-0">
          {/* Logo expandida */}
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo width={180} />
          </div>

          {/* Ícone quando colapsado */}
          <div className="hidden bg-accent/10 rounded-md p-1 group-data-[collapsible=icon]:flex">
            <div className="w-8 ">
              <Logo icon={true} />
            </div>
          </div>
        </div>
      </SidebarHeader>
      {/* <SidebarHeader>
        <div className="bg-accent/10 rounded-md p-4">
          <Logo />
        </div>
      </SidebarHeader> */}
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
