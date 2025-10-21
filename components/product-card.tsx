"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/store"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2">{product.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="font-semibold leading-tight text-balance">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 text-pretty">{product.description}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <span className="text-2xl font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</span>
          <Button onClick={handleAddToCart} size="sm" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
