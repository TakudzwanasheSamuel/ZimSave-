
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  sender: "user" | "bot";
  text: string;
  language?: string;
}

export function ChatMessage({ sender, text, language }: ChatMessageProps) {
  const isUser = sender === "user";
  return (
    <div
      className={cn(
        "flex items-start space-x-3 py-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs rounded-lg p-3 shadow lg:max-w-md",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        {!isUser && language && (
            <p className="text-xs text-muted-foreground mt-1">Language: {language.toUpperCase()}</p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
           <AvatarFallback><User size={20} /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
