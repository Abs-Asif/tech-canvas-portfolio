import React, { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const AiAssistant = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [instructions, setInstructions] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load instructions
    fetch("/assistant-instructions.txt")
      .then((res) => res.text())
      .then((text) => setInstructions(text))
      .catch((err) => console.error("Failed to load instructions:", err));

    // Load session from localStorage
    const savedMessages = localStorage.getItem("ai_assistant_session");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        { role: "assistant", content: "Hello there. I'm Abdullah Bari's Virtual Assistance. How may i help?" }
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai_assistant_session", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClose = () => {
    localStorage.removeItem("ai_assistant_session");
    setMessages([{ role: "assistant", content: "Hello there. I'm Abdullah Bari's Virtual Assistance. How may i help?" }]);
    onClose();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Ensure instructions are loaded
      let currentInstructions = instructions;
      if (!currentInstructions) {
        const res = await fetch("/assistant-instructions.txt");
        currentInstructions = await res.text();
        setInstructions(currentInstructions);
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Abdullah Bari Portfolio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t-chimera:free",
          messages: [
            { role: "system", content: currentInstructions },
            ...newMessages
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const assistantMessage = data.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-background border-t border-border flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-sm font-mono font-bold text-foreground uppercase tracking-widest">Virtual Assistant</h2>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={msg.role === 'user'
                ? "max-w-[85%] bg-primary/10 border border-primary/20 text-foreground px-4 py-2 rounded-2xl rounded-tr-none shadow-[0_0_20px_rgba(34,197,94,0.05)] font-mono text-sm"
                : "w-full prose prose-invert prose-p:leading-relaxed prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border max-w-none text-justify text-muted-foreground"
              }>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center gap-2 text-primary font-mono text-xs">
              <Loader2 className="animate-spin" size={14} />
              <span>assistant is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about Abdullah or coding..."
            className="flex-1 bg-secondary/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 font-mono text-sm transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground p-3 rounded-xl hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3 font-mono opacity-50">
          Powered by DeepSeek R1 via OpenRouter
        </p>
      </div>
    </div>
  );
};
