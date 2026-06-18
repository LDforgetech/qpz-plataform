"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import SearchBar from "@/components/search-bar";

export function AppHeader() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 pl-14 md:pr-8">
        {/* Left: sidebar toggle + search */}
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="text-muted-foreground" />
          <SearchBar />
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-3 ml-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell size={18} />
          </Button>
          {isLoaded && isSignedIn && <UserButton showName />}
        </div>
      </div>
    </header>
  );
}
