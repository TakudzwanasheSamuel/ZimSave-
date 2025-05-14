
import { PageHeader } from "@/components/shared/page-header";
import { ChatWindow } from "@/components/chatbot/chat-window";

export default function ChatbotPage() {
  return (
    <div className="container mx-auto p-0 md:p-4 h-full flex flex-col"> {/* Adjusted padding for mobile to maximize chat window */}
      <div className="hidden md:block"> {/* Hide PageHeader on mobile for more chat space */}
        <PageHeader
            title="AI Chatbot"
            description="Get instant financial and health literacy advice in Shona, Ndebele, or English."
        />
      </div>
      <div className="flex-grow"> {/* Ensure ChatWindow takes remaining space */}
        <ChatWindow />
      </div>
    </div>
  );
}
