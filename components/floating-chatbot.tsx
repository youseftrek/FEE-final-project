"use client";

import * as React from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const MAX_MESSAGES = 10;
const STORAGE_KEY = "chatbot-history";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResumeDialog, setShowResumeDialog] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Show resume dialog when chatbot is opened
          if (isOpen && messages.length === 0) {
            setShowResumeDialog(true);
          }
        }
      } catch (error) {
        console.error("Failed to parse chat history:", error);
      }
    }
  }, [isOpen]);

  // Save messages to localStorage (max 10)
  const saveToLocalStorage = (msgs: Message[]) => {
    const recentMessages = msgs.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages));
  };

  const handleResume = () => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setMessages(parsed);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
    setShowResumeDialog(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowResumeDialog(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        };

        const newMessages = [...updatedMessages, assistantMessage];
        setMessages(newMessages);
        saveToLocalStorage(newMessages);
      } else {
        toast.error("Failed to get response", {
          description: data.message || "Please try again",
        });
      }
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please check your connection and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-primary via-purple-600 to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group hover:scale-105"
        >
          <Sparkles className="h-6 w-6 text-white" />

          {/* Active indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
          </span>

          {/* Floating particles */}
          <span
            className="absolute -top-1 -left-1 h-1.5 w-1.5 bg-foreground rounded-full animate-ping"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="absolute -bottom-1 -right-1 h-1.5 w-1.5 bg-foreground rounded-full animate-ping"
            style={{ animationDelay: "0.7s" }}
          />
          <span
            className="absolute top-0 right-0 h-1 w-1 bg-forbg-foreground rounded-full animate-ping"
            style={{ animationDelay: "1.4s" }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 py-0 right-6 w-96 h-[600px] z-50 flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary via-purple-600 to-orange-500 text-white p-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <CardTitle className="text-lg">AI Fitness Coach</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewChat}
                  className="h-8 w-8 text-white hover:bg-white/20"
                  title="New Chat"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Resume Dialog */}
          {showResumeDialog && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-center p-6">
              <div className="bg-card border rounded-lg p-6 max-w-sm space-y-4">
                <h3 className="text-lg font-semibold">
                  Continue Previous Chat?
                </h3>
                <p className="text-sm text-muted-foreground">
                  You have a previous conversation. Would you like to resume it
                  or start fresh?
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleResume} className="flex-1">
                    Resume
                  </Button>
                  <Button
                    onClick={handleNewChat}
                    variant="outline"
                    className="flex-1"
                  >
                    New Chat
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-4 pr-4">
                {messages.length === 0 && !showResumeDialog && (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                    <Sparkles className="h-12 w-12 text-primary" />
                    <p className="font-medium">Welcome to AI Fitness Coach!</p>
                    <p className="text-sm">
                      Ask me anything about fitness, nutrition, or workouts.
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="border-t p-3 shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about fitness, diet, workouts..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
