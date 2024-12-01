import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { CartProvider } from "./components/providers/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TechGear Pro - Premium Tech Products",
  description: "Your one-stop shop for premium tech products and accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
