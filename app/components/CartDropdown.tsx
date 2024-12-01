"use client";

import { useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./providers/CartProvider";
import { products } from "@/data/products";
import { useClickOutside } from "@/app/hooks/useClickOutside";

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, totalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const cartTotal = items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <Button
        variant="ghost"
        className="relative text-muted-foreground hover:text-foreground transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {totalItems}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 bg-card border">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">
              Shopping Cart
            </h3>
            <div className="space-y-3">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.id);
                if (!product) return null;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${product.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold text-card-foreground">
                <span>Total:</span>
                <span>${cartTotal}</span>
              </div>
              <Button className="w-full mt-4">Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
