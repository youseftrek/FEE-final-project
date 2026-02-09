"use client";

import * as React from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Flame,
  Apple,
  Wheat,
  Droplet,
  Info,
  CheckCircle2,
  TrendingUp,
  History,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Client } from "@gradio/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const MAX_MESSAGES = 10;
const STORAGE_KEY = "chatbot-history";
const IMAGE_HISTORY_KEY = "chatbot-image-history";
const MAX_IMAGE_HISTORY = 10;

interface ImageAnalysis {
  imagePreview: string;
  response: any;
  timestamp: number;
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResumeDialog, setShowResumeDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("chat");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [imageResponse, setImageResponse] = React.useState<any>(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = React.useState(false);
  const [imageHistory, setImageHistory] = React.useState<ImageAnalysis[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    // Load image history
    const savedImageHistory = localStorage.getItem(IMAGE_HISTORY_KEY);
    if (savedImageHistory) {
      try {
        const parsed = JSON.parse(savedImageHistory);
        setImageHistory(parsed);
      } catch (error) {
        console.error("Failed to parse image history:", error);
      }
    }
  }, [isOpen]);

  // Save messages to localStorage (max 10)
  const saveToLocalStorage = (msgs: Message[]) => {
    const recentMessages = msgs.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages));
  };

  // Save image analysis to localStorage
  const saveImageAnalysis = (preview: string, response: any) => {
    const newAnalysis: ImageAnalysis = {
      imagePreview: preview,
      response: response,
      timestamp: Date.now(),
    };

    const updatedHistory = [newAnalysis, ...imageHistory].slice(
      0,
      MAX_IMAGE_HISTORY,
    );
    setImageHistory(updatedHistory);
    localStorage.setItem(IMAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !imagePreview) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploadingImage(true);
    setImageResponse(null);

    try {
      // Convert File to Blob (it already is a Blob, but being explicit)
      const imageBlob = selectedImage;

      // Connect to the Gradio client
      const client = await Client.connect("AhmedBelal/smart-diet-api");

      // Make prediction
      const result = await client.predict("/predict_food", {
        image: imageBlob,
      });

      // Log the response to console
      console.log("HuggingFace API Response:", result.data);
      setImageResponse(result.data);
      setIsAnalysisComplete(true);

      // Save to localStorage
      saveImageAnalysis(imagePreview, result.data);

      toast.success("Image analyzed successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to analyze image", {
        description: "Please try again later",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageResponse(null);
    setIsAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadPreviousAnalysis = (analysis: ImageAnalysis) => {
    setImagePreview(analysis.imagePreview);
    setImageResponse(analysis.response);
    setIsAnalysisComplete(true);
    setSelectedImage(null); // No file object for previous analyses
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
            className="absolute top-0 right-0 h-1 w-1 bg-foreground rounded-full animate-ping"
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

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="mx-4 mt-3 grid w-[calc(100%-2rem)] grid-cols-2">
              <TabsTrigger value="chat" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Upload
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 min-h-0 mt-3">
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full px-4 py-4">
                    <div className="space-y-4 pr-4">
                      {messages.length === 0 && !showResumeDialog && (
                        <div className="h-[350px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                          <Sparkles className="h-12 w-12 text-primary" />
                          <p className="font-medium">
                            Welcome to AI Fitness Coach!
                          </p>
                          <p className="text-sm">
                            Ask me anything about fitness, nutrition, or
                            workouts.
                          </p>
                        </div>
                      )}

                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex",
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start",
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

                {/* Chat Input */}
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
              </div>
            </TabsContent>

            {/* Image Upload Tab */}
            <TabsContent value="upload" className="flex-1 min-h-0 mt-3">
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <ScrollArea className="h-full px-4 py-4">
                    <div className="space-y-4 pr-4">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />

                        {!imagePreview ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium text-muted-foreground">
                              Click to upload food image
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Get nutrition categories
                            </p>
                          </div>
                        ) : (
                          <div className="w-full space-y-3">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            {!isAnalysisComplete && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => fileInputRef.current?.click()}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Change Image
                                </Button>
                                <Button
                                  onClick={clearImage}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Clear
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {imageResponse && (
                          <div className="w-full space-y-4">
                            {/* Success Header */}
                            {imageResponse[2]?.success && (
                              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                    Analysis Complete
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {imageResponse[2].total_items} food item(s) detected
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Food Items */}
                            {imageResponse[2]?.items?.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-gradient-to-br from-primary/5 to-purple-500/5 border rounded-lg p-4 space-y-3"
                              >
                                {/* Food Name & Confidence */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-bold text-lg capitalize">
                                      {item.name}
                                    </h4>
                                    {item.found && (
                                      <Badge variant="secondary" className="mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {Math.round(item.confidence * 100)}% confidence
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Nutrition Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-background/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Flame className="h-4 w-4 text-orange-500" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Calories
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold">
                                      {item.calories_100g}
                                      <span className="text-xs font-normal text-muted-foreground ml-1">
                                        kcal
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Apple className="h-4 w-4 text-red-500" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Protein
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold">
                                      {item.protein_100g}
                                      <span className="text-xs font-normal text-muted-foreground ml-1">
                                        g
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Wheat className="h-4 w-4 text-amber-500" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Carbs
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold">
                                      {item.carbs_100g}
                                      <span className="text-xs font-normal text-muted-foreground ml-1">
                                        g
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Droplet className="h-4 w-4 text-blue-500" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Fat
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold">
                                      {item.fat_100g}
                                      <span className="text-xs font-normal text-muted-foreground ml-1">
                                        g
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                {item.info && (
                                  <div className="bg-background/50 rounded-lg p-3 space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Info className="h-4 w-4 text-blue-500" />
                                      <span className="text-xs font-semibold">
                                        Nutritional Information
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {item.info}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Note */}
                            {imageResponse[2]?.note && (
                              <div className="bg-muted/50 border border-dashed rounded-lg p-3">
                                <p className="text-xs text-muted-foreground text-center">
                                  💡 {imageResponse[2].note}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* History Section */}
                        {!imagePreview && imageHistory.length > 0 && (
                          <div className="w-full space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <History className="h-4 w-4" />
                              <h4 className="text-sm font-semibold">Recent Analyses</h4>
                            </div>
                            <div className="space-y-2">
                              {imageHistory.map((analysis, idx) => {
                                const foodName =
                                  analysis.response?.[2]?.items?.[0]?.name || "Unknown";
                                const totalItems =
                                  analysis.response?.[2]?.total_items || 0;
                                const date = new Date(analysis.timestamp);

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => loadPreviousAnalysis(analysis)}
                                    className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                  >
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-background flex-shrink-0">
                                      <img
                                        src={analysis.imagePreview}
                                        alt="Previous analysis"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <p className="text-sm font-semibold capitalize truncate">
                                        {foodName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {totalItems} item(s) detected
                                      </p>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">
                                          {date.toLocaleDateString()} at{" "}
                                          {date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Upload Button */}
                <div className="border-t p-3 shrink-0">
                  {isAnalysisComplete ? (
                    <Button
                      onClick={clearImage}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      New Analysis
                    </Button>
                  ) : (
                    <Button
                      onClick={handleImageUpload}
                      disabled={!selectedImage || isUploadingImage}
                      className="w-full"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </>
  );
}
