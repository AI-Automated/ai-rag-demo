import { openai } from "@ai-sdk/openai"
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

interface ProductInfo {
  id: number;
  title: string;
  content: string;
  info_type: string;
  metadata: {
    product_name: string;
    category: string;
    price: number;
  };
}

interface GroupedInfo {
  [key: string]: ProductInfo[];
}

// Function to extract price ranges from a message
function extractPriceRange(message: string): { min?: number; max?: number } {
  const underPattern = /under\s*\$?(\d+)/i;
  const overPattern = /over\s*\$?(\d+)/i;
  const betweenPattern = /between\s*\$?(\d+)\s*(?:and|to)\s*\$?(\d+)/i;
  const aroundPattern = /around\s*\$?(\d+)/i;

  const betweenMatch = message.match(betweenPattern);
  if (betweenMatch) {
    return {
      min: parseInt(betweenMatch[1]),
      max: parseInt(betweenMatch[2])
    };
  }

  const underMatch = message.match(underPattern);
  if (underMatch) {
    return { max: parseInt(underMatch[1]) };
  }

  const overMatch = message.match(overPattern);
  if (overMatch) {
    return { min: parseInt(overMatch[1]) };
  }

  const aroundMatch = message.match(aroundPattern);
  if (aroundMatch) {
    const price = parseInt(aroundMatch[1]);
    return {
      min: price - 100,
      max: price + 100
    };
  }

  return {};
}

// Function to extract categories from a message
function extractCategory(message: string): string[] {
  const categoryPatterns = [
    { pattern: /\b(?:phone|smartphone|mobile|cell|x1)\b/i, category: "Smartphones" },
    { pattern: /\b(?:earbuds|headphones|earphones|audio|soundwave)\b/i, category: "Audio" },
    { pattern: /\b(?:charger|battery|power|powermax)\b/i, category: "Accessories" },
    { pattern: /\b(?:watch|smartwatch|wearable)\b/i, category: "Wearables" },
    { pattern: /\b(?:laptop|computer|ultrabook|notebook)\b/i, category: "Computers" },
    { pattern: /\b(?:controller|gaming|game|gamepad)\b/i, category: "Gaming" },
    { pattern: /\b(?:smart\s*home|hub|automation)\b/i, category: "Smart Home" },
    { pattern: /\b(?:camera|photo|video|4k)\b/i, category: "Cameras" },
    { pattern: /\b(?:tablet|ipad|slate)\b/i, category: "Tablets" }
  ];

  return categoryPatterns
    .filter(({ pattern }) => pattern.test(message))
    .map(({ category }) => category);
}

// Function to extract product names from a message
function extractProductNames(message: string): string[] {
  const productPatterns = [
    { 
      pattern: /\b(?:x1|techpro x1|techpro smartphone|phone|smartphone)\b/i,
      fullName: "TechPro X1 Smartphone"
    },
    { 
      pattern: /\b(?:soundwave|earbuds|soundwave pro|headphones|earphones)\b/i,
      fullName: "SoundWave Pro Earbuds"
    },
    { 
      pattern: /\b(?:powermax|charger|powermax 20000|battery pack|power bank)\b/i,
      fullName: "PowerMax 20000 Charger"
    },
    { 
      pattern: /\b(?:watch|watch elite|techpro watch|smartwatch)\b/i,
      fullName: "TechPro Watch Elite"
    },
    { 
      pattern: /\b(?:ultrabook|laptop|ultrabook pro|computer|notebook)\b/i,
      fullName: "UltraBook Pro"
    },
    { 
      pattern: /\b(?:gamepro|controller|game controller|gamepad|gaming)\b/i,
      fullName: "GamePro Controller"
    },
    { 
      pattern: /\b(?:smarthome|hub|smart home|automation|smart hub)\b/i,
      fullName: "SmartHome Hub"
    },
    { 
      pattern: /\b(?:4k|camera|ultra camera|video camera|digital camera)\b/i,
      fullName: "4K Ultra Camera"
    },
    { 
      pattern: /\b(?:tablet|tablet pro|techpro tablet|ipad|slate)\b/i,
      fullName: "TechPro Tablet Pro"
    }
  ];

  return productPatterns
    .filter(({ pattern }) => pattern.test(message))
    .map(({ fullName }) => fullName);
}

export async function POST(req: Request) {
  // Extract the messages from the body of the request
  const { messages } = await req.json();

  // Get the last user message
  const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
  const userQuestion = lastUserMessage.content;

  // Extract search criteria
  const mentionedProducts = extractProductNames(userQuestion);
  const categories = extractCategory(userQuestion);
  const priceRange = extractPriceRange(userQuestion);

  // Prepare the search query - keep short words as they might be important (like "X1")
  const searchQuery = userQuestion
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim()
    .split(/\s+/)
    .join(' | '); // Join words with OR operator for broader matches

  // Build the query conditions
  let query = supabase
    .from("customer_service_info")
    .select("*");

  // Add product name filter if specific products are mentioned
  if (mentionedProducts.length > 0) {
    query = query.or(
      mentionedProducts.map(name => 
        `metadata->>product_name.eq.${JSON.stringify(name)}`
      ).join(',')
    );
  }

  // Add category filter if categories are mentioned
  if (categories.length > 0) {
    query = query.or(
      categories.map(category => 
        `metadata->>category.eq.${JSON.stringify(category)}`
      ).join(',')
    );
  }

  // Add price range filter if specified
  if (priceRange.min !== undefined) {
    query = query.gte('metadata->>price', priceRange.min);
  }
  if (priceRange.max !== undefined) {
    query = query.lte('metadata->>price', priceRange.max);
  }

  // Execute the query
  let { data: relevantInfo, error } = await query;

  // If no results from metadata search, try text search
  if ((!relevantInfo || relevantInfo.length === 0) && searchQuery) {
    const { data: searchData, error: searchError } = await supabase
      .from("customer_service_info")
      .select("*")
      .textSearch("content", searchQuery, {
        type: 'websearch',
        config: 'english'
      })
      .limit(5);

    if (searchError) throw searchError;
    relevantInfo = searchData;
  }

  if (error) throw error;

  // Group chunks by product name
  const groupedInfo = (relevantInfo as ProductInfo[]).reduce<GroupedInfo>((acc, info) => {
    if (info.info_type === 'product_specs') {
      const productName = info.metadata.product_name;
      if (!acc[productName]) {
        acc[productName] = [];
      }
      acc[productName].push(info);
    } else {
      if (!acc.general) {
        acc.general = [];
      }
      acc.general.push(info);
    }
    return acc;
  }, {});

  // Combine chunks for each product
  const context = Object.entries(groupedInfo)
    .map(([key, items]) => {
      if (key === 'general') {
        return items.map(item => item.content).join('\n\n');
      }
      return `Product Information for ${key}:\n${
        items.map(item => item.content).join('\n\n')
      }`;
    })
    .join('\n\n---\n\n');

  // Prepare messages for OpenAI
  const aiMessages = [
    {
      role: "system",
      content: `You are a helpful customer service assistant for TechGear Pro, a premium tech products retailer. 
      Use the following information to answer the user's question, but do not mention that you're using any specific source: 
      
      ${context}
      
      Guidelines:
      1. If you don't have specific information about a product or service, provide general information but make it clear you're speaking about general features.
      2. When comparing products, focus on factual differences based on the provided specifications.
      3. Always be professional, friendly, and highlight the benefits and features that matter most to the customer.
      4. If a customer asks about pricing or availability, provide the listed price and general availability information.
      5. For technical specifications, be precise and use the exact numbers and features mentioned in the product information.
      6. If a customer mentions a product partially or by category, suggest relevant products from our catalog.
      7. If a customer asks about price ranges, mention all products that fit within their budget.
      8. If you're not sure which product a customer is referring to, ask for clarification while suggesting possible matches.`
    },
    ...messages,
  ];

  // Ask OpenAI for a streaming chat completion
  const result = streamText({
    model: openai("gpt-4"),
    messages: aiMessages,
    temperature: 0.7,
    maxTokens: 1000
  });

  return result.toDataStreamResponse();
}

