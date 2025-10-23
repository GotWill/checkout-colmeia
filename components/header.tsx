"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/app/store/user";
import { useCartStore } from "@/app/store/cart";

export function Header() {
  const { user } = useStore();
  const { cart } = useCartStore();

  const words = user.name.split(" ");

  const first = words[0];
  const last = words[words.length - 1];

  const initials = first[0].toUpperCase() + last[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/catalog" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              S
            </span>
          </div>
          <span className="text-lg font-bold">Store</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/catalog">
            <Button variant="ghost" size="sm">
              Catálogo
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {cart.length}
                </Badge>
              )}
            </Button>
          </Link>

          {user.isAuthenticate ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground bg-gray-200 p-2 rounded-sm font-bold">
                {initials}
              </span>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
