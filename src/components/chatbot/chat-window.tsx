
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatMessage, type ChatMessageProps } from "./chat-message";
import { financialHealthChatbot } from "@/ai/flows/financial-health-chatbot";
import { Send, Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Language = "en" | "sn" | "nd";

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessageProps = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await financialHealthChatbot({
        language,
        userInput: input,
      });
      const botMessage: ChatMessageProps = {
        sender: "bot",
        text: response.chatbotResponse,
        language: language,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessageProps = {
        sender: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        language: language,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Chatbot Error",
        description: "Could not get a response from the chatbot. Please check your connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-lg border bg-card shadow-lg md:h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-semibold text-primary">AI Financial & Health Advisor</h2>
        <div className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sn">Shona</SelectItem>
              <SelectItem value="nd">Ndebele</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle size={48} className="mx-auto mb-2" />
              <p>Welcome to the ZimVest AI Advisor!</p>
              <p>Ask me about financial literacy, health tips, or group savings.</p>
              <p className="mt-2">Select your preferred language and type your question below.</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <ChatMessage key={index} sender={msg.sender} text={msg.text} language={msg.language} />
          ))}
          {isLoading && (
            <div className="flex justify-start items-center space-x-3 py-3">
               <Loader2 className="h-8 w-8 text-primary animate-spin" />
               <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t p-3">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
