"use client";

import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

export function AppHeader() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: sidebar toggle + search */}
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="text-muted-foreground" />

          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar cursos e/ou trilhas"
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-3 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <Bell size={18} />
          </Button>
          {isLoaded && isSignedIn && <UserButton showName />}
        </div>
      </div>
    </header>
  );
}
