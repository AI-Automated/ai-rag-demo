export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface MessageBubbleProps {
  message: Message;
} 