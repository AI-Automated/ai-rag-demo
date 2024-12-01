import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const productMap: { [key: string]: string } = {
      "1": "techpro-x1-smartphone",
      "2": "soundwave-pro-earbuds",
      "3": "powermax-20000-charger",
      "4": "techpro-watch-elite",
      "5": "ultrabook-pro",
      "6": "gamepro-controller",
      "7": "smarthome-hub",
      "8": "4k-ultra-camera",
      "9": "techpro-tablet-pro",
    };

    const fileName = productMap[params.id];
    if (!fileName) {
      return new Response("Product not found", { status: 404 });
    }

    const filePath = path.join(
      process.cwd(),
      "product-specs",
      `${fileName}.md`
    );
    const markdown = await fs.readFile(filePath, "utf8");
    const content = marked(markdown);

    return new Response(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error loading product details:", error);
    return new Response("Error loading product details", { status: 500 });
  }
}