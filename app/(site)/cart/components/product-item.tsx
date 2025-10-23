import { CartItem, useCartStore } from "@/app/store/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { Minus, Plus, Trash2 } from "lucide-react";

type ProductItemProps = {
data: CartItem;
index: number
}

import Image from "next/image";
import { toast } from "sonner";

export default function ProductItem({data, index}: ProductItemProps) {

    const {removeProduct, updateQuantity} = useCartStore()

    function handleUpdateCart(){
        if(data.quantity > 1){
            updateQuantity(data.cart.id, data.quantity - 1)
            return
        }
        handleRemoveProduct()
    }

    function handleRemoveProduct(){
      removeProduct(data.cart.id) 
      toast.success(`Item removido`)
    }

  return (
    <div key={data.cart.id}>
      {index > 0 && <Separator className="my-4" />}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full h-72 md:h-24 md:w-24  overflow-hidden rounded-lg bg-secondary">
          <Image
            src={data.cart.image || "/placeholder.svg"}
            alt={data.cart.image}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 md:gap-0">
          <div>
            <h3 className="font-semibold text-balance">{data.cart.name}</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              {data.cart.description}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-center md:flex-row justify-between gap-3 md:gap-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={handleUpdateCart}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {data.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => updateQuantity(data.cart.id, data.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">
                {formatPrice(data.cart.price * data.quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={handleRemoveProduct}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
