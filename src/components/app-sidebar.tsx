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
import { HomeIcon, SparklesIcon, AwardIcon, BookUserIcon } from "lucide-react";
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
      url: "./dashboard",
      icon: <HomeIcon />,
    },
    {
      name: "Minha Trilha",
      url: "./minha-trilha",
      icon: <SparklesIcon />,
    },
    {
      name: "Certificados",
      url: "./certificados",
      icon: <AwardIcon />,
    },
    {
      name: "Contato",
      url: "contato",
      icon: <BookUserIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="bg-accent/10 rounded-md p-4">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
