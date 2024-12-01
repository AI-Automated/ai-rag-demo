"use client";

import { useState, useRef } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, MessageCircle } from "lucide-react";
import { useClickOutside } from "@/app/hooks/useClickOutside";

const commonQuestions = [
  "What's your return policy?",
  "Do you offer international shipping?",
  "Tell me about the TechPro X1 Smartphone",
  "What warranty comes with your products?",
];

const findProductInMessage = (message: string): string | null => {
  const products = [
    "ultrabook-pro",
    "techpro-x1-smartphone",
    "techpro-watch-elite",
    "soundwave-pro-earbuds",
    "smarthome-hub",
    "powermax-20000-charger",
    "gamepro-controller",
    "4k-ultra-camera",
    "techpro-tablet-pro",
  ];

  for (const product of products) {
    const productName = product.replace(/-/g, " ");
    if (message.toLowerCase().includes(productName.toLowerCase())) {
      return product;
    }
  }
  return null;
};

export default function CustomerServiceChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
  } = useChat();
  const [orderNumber, setOrderNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useClickOutside(chatRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const askPredefinedQuestion = async (question: string) => {
    setInput(question);
    await new Promise((resolve) => setTimeout(resolve, 0));
    handleSubmit({
      preventDefault: () => {},
      target: { elements: [] },
    } as unknown as React.FormEvent<HTMLFormElement>);
  };

  const trackOrder = async () => {
    if (orderNumber.trim()) {
      try {
        const response = await fetch(
          `/api/track-order?tracking_number=${orderNumber}`
        );
        const data = await response.json();

        if (response.ok) {
          const formattedDate = new Date(data.order_date).toLocaleDateString();
          const formattedDeliveryDate = new Date(
            data.expected_delivery
          ).toLocaleDateString();

          // Create the message object directly
          const message = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content:
              `🚚 Order Status:\n\n` +
              `Tracking Number: ${data.tracking_number}\n` +
              `Order Date: ${formattedDate}\n` +
              `Status: ${data.status}\n` +
              `Expected Delivery: ${formattedDeliveryDate}\n\n` +
              `Items:\n${data.items
                .map((item: any) => `- ${item.name} (Qty: ${item.quantity})`)
                .join("\n")}\n\n` +
              `Recent Updates:\n${data.shipping_updates
                .slice(-3)
                .map(
                  (update: any) =>
                    `- ${new Date(update.date).toLocaleDateString()}: ${
                      update.status
                    } at ${update.location}`
                )
                .join("\n")}`,
          };

          // Add the message directly to the chat
          messages.push(message);
        } else {
          messages.push({
            id: Date.now().toString(),
            role: "assistant" as const,
            content:
              "I couldn't find an order with that tracking number. Please verify and try again.",
          });
        }
      } catch (error) {
        console.error("Error tracking order:", error);
        messages.push({
          id: Date.now().toString(),
          role: "assistant" as const,
          content:
            "Sorry, there was an error tracking your order. Please try again later.",
        });
      }
      setOrderNumber("");
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>
    );
  }

  return (
    <Card
      ref={chatRef}
      className="fixed bottom-4 right-4 w-[400px] h-[750px] shadow-lg"
    >
      <CardHeader className="border-b relative py-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-card-foreground">
          Customer Service
        </h2>
      </CardHeader>

      <CardContent className="p-4 flex flex-col h-[calc(100%-4rem)]">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {commonQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => askPredefinedQuestion(question)}
              className="text-left h-auto py-2 text-xs whitespace-normal"
              size="sm"
            >
              {question}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number"
            className="text-sm"
          />
          <Button onClick={trackOrder} size="sm">
            Track
          </Button>
        </div>

        <ScrollArea className="flex-1 mb-2">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-muted text-muted-foreground ml-0"
                    : "bg-primary text-primary-foreground ml-auto"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
