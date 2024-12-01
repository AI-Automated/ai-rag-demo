import { ProductGrid } from "@/app/components/ProductGrid";
import CustomerServiceChat from "@/app/components/CustomerServiceChat";
import { CartDropdown } from "@/app/components/CartDropdown";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-foreground">
                TechGear Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CartDropdown />
              <a
                href="/support"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Featured Products
        </h2>
        <ProductGrid isOpen={false} />
      </div>

      <CustomerServiceChat />
    </main>
  );
}
