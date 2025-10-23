"use client";

import { redirect, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import ProductItem from "./components/product-item";
import { formatPrice } from "@/lib/format-price";
import { useCartStore } from "@/app/store/cart";
import { useStore } from "@/app/store/user";

export default function CartPage() {
  const router = useRouter();

  const { cart, cartHydrated} = useCartStore();
  const {user} = useStore()

  const cartTotal = cart.reduce((acc, item) => acc + item.cart.price * item.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if(!user.isAuthenticate){
      redirect("/auth?redirect=/checkout")
    }

    router.push("/checkout");
  };

  if(!cartHydrated) return null

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-balance">
              Seu carrinho está vazio
            </h2>
            <p className="text-muted-foreground text-pretty">
              Adicione produtos para continuar
            </p>
            <Link href="/catalog">
              <Button className="mt-4">Ir para o Catálogo</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Carrinho de Compras
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            {cart.length} itens no carrinho
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <ProductItem key={index} data={item} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Resumo do Pedido</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-accent">Grátis</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                    {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="mt-6 w-full"
                  size="lg"
                >
                  Finalizar Compra
                </Button>

                <Link href="/catalog">
                  <Button variant="ghost" className="mt-2 w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
