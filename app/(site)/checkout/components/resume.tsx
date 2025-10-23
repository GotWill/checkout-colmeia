import { useCartStore } from "@/app/store/cart";
import { useStore } from "@/app/store/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { Separator } from "@radix-ui/react-separator";

export default function Resume() {

  const {cart, cartHydrated} = useCartStore();
  const {user} = useStore()

  const cartTotal = cart.reduce((acc, item) => acc + item.cart.price * item.quantity, 0)

  if(!cartHydrated) return null

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-accent">Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {user.isAuthenticate && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">Enviando para:</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
