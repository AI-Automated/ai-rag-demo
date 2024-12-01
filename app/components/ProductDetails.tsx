"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "./providers/CartProvider";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductDetailsProps {
  productId: string;
  product: Product;
}

export function ProductDetails({ productId, product }: ProductDetailsProps) {
  const [details, setDetails] = useState<string>("");
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        setDetails(data.content);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="relative pt-[100%]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-cover rounded-t-lg"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <p className="text-3xl font-bold">${product.price}</p>
              <p className="text-muted-foreground">{product.description}</p>
            </CardHeader>
            <CardContent>
              {quantity === 0 ? (
                <Button className="w-full" onClick={() => addItem(product.id)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: details }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
