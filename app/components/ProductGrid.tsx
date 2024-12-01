"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "./providers/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

interface ProductGridProps {
  isOpen: boolean;
}

export function ProductGrid({ isOpen }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, removeItem, getItemQuantity, updateQuantity } = useCart();

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div
      className={`grid gap-6 p-6 transition-[margin] duration-300 ${
        isOpen ? "mr-[400px] ml-6" : "mx-auto max-w-7xl"
      }`}
    >
      <div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const quantity = getItemQuantity(product.id);

            return (
              <Card key={product.id} className="flex flex-col">
                <div className="relative pt-[56.25%] bg-muted rounded-t-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <span className="text-lg font-bold">${product.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto flex flex-col gap-2">
                  {quantity === 0 ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => addItem(product.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          (window.location.href = `/products/${product.id}`)
                        }
                      >
                        See Details
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="mx-2 font-semibold">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full"
                        onClick={() =>
                          (window.location.href = `/products/${product.id}`)
                        }
                      >
                        See Details
                      </Link>
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
