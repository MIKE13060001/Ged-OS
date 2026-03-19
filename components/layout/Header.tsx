"use client";

import { Search, Bell, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 z-20 shrink-0">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Rechercher dans la GED..."
            className="pl-9 bg-muted/50 border-border focus-visible:ring-primary/50 h-9"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 group cursor-pointer">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-foreground leading-none">G. Architect</p>
                <p className="text-[10px] text-primary font-bold tracking-tighter uppercase mt-0.5">Enterprise Admin</p>
              </div>
              <Avatar className="h-9 w-9 rounded-xl border border-border group-hover:border-primary/50 transition-colors">
                <AvatarFallback className="rounded-xl bg-muted text-primary">
                  <LayoutGrid size={16} />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">G. Architect</p>
                <p className="text-xs leading-none text-muted-foreground">admin@gedos.fr</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
