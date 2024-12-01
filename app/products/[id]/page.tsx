import { ProductDetails } from "@/app/components/ProductDetails";
import CustomerServiceChat from "@/app/components/CustomerServiceChat";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </nav>
      <ProductDetails productId={params.id} product={product} />
      <CustomerServiceChat />
    </div>
  );
}
