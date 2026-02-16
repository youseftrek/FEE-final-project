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
          history: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
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
          className="group right-6 bottom-6 z-50 fixed flex justify-center items-center bg-gradient-to-br from-primary via-purple-600 to-orange-500 shadow-lg hover:shadow-xl rounded-full w-14 h-14 hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="w-6 h-6 text-white" />

          {/* Active indicator */}
          <span className="-top-1 -right-1 absolute flex w-4 h-4">
            <span className="inline-flex absolute bg-green-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
            <span className="inline-flex relative bg-green-500 border-2 border-white rounded-full w-4 h-4"></span>
          </span>

          {/* Floating particles */}
          <span
            className="-top-1 -left-1 absolute bg-foreground rounded-full w-1.5 h-1.5 animate-ping"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="-right-1 -bottom-1 absolute bg-foreground rounded-full w-1.5 h-1.5 animate-ping"
            style={{ animationDelay: "0.7s" }}
          />
          <span
            className="top-0 right-0 absolute bg-foreground rounded-full w-1 h-1 animate-ping"
            style={{ animationDelay: "1.4s" }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="right-6 bottom-6 z-50 fixed flex flex-col shadow-2xl py-0 w-96 h-[600px] overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary via-purple-600 to-orange-500 p-4 text-white shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <CardTitle className="text-lg">AI Fitness Coach</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewChat}
                  className="hover:bg-white/20 w-8 h-8 text-white"
                  title="New Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 w-8 h-8 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Resume Dialog */}
          {showResumeDialog && (
            <div className="z-10 absolute inset-0 flex justify-center items-center bg-background/95 backdrop-blur-sm p-6">
              <div className="space-y-4 bg-card p-6 border rounded-lg max-w-sm">
                <h3 className="font-semibold text-lg">
                  Continue Previous Chat?
                </h3>
                <p className="text-muted-foreground text-sm">
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
            className="flex flex-col flex-1 min-h-0"
          >
            <TabsList className="grid grid-cols-2 mx-4 mt-3 w-[calc(100%-2rem)]">
              <TabsTrigger value="chat" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Image Upload
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 mt-3 min-h-0">
              <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                  <ScrollArea className="px-4 py-4 h-full">
                    <div className="space-y-4 pr-4">
                      {messages.length === 0 && !showResumeDialog && (
                        <div className="flex flex-col justify-center items-center space-y-2 h-[350px] text-muted-foreground text-center">
                          <Sparkles className="w-12 h-12 text-primary" />
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
                              "px-4 py-2 rounded-lg max-w-[80%] text-sm",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted",
                            )}
                          >
                            <p className="break-words whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted px-4 py-2 rounded-lg">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t shrink-0">
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
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Image Upload Tab */}
            <TabsContent value="upload" className="flex-1 mt-3 min-h-0">
              <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                  <ScrollArea className="px-4 py-4 h-full">
                    <div className="space-y-4 pr-4">
                      <div className="flex flex-col justify-center items-center space-y-4">
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
                            className="flex flex-col justify-center items-center border-2 border-muted-foreground/25 hover:border-primary/50 border-dashed rounded-lg w-full h-64 transition-colors cursor-pointer"
                          >
                            <Upload className="mb-2 w-12 h-12 text-muted-foreground" />
                            <p className="font-medium text-muted-foreground text-sm">
                              Click to upload food image
                            </p>
                            <p className="mt-1 text-muted-foreground text-xs">
                              Get nutrition categories
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 w-full">
                            <div className="relative bg-muted rounded-lg w-full h-64 overflow-hidden">
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
                          <div className="space-y-4 w-full">
                            {/* Success Header */}
                            {imageResponse[2]?.success && (
                              <div className="flex items-center gap-2 bg-green-500/10 p-3 border border-green-500/20 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <div className="flex-1">
                                  <p className="font-semibold text-green-700 dark:text-green-400 text-sm">
                                    Analysis Complete
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {imageResponse[2].total_items} food item(s) detected
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Food Items */}
                            {imageResponse[2]?.items?.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="space-y-3 bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 border rounded-lg"
                              >
                                {/* Food Name & Confidence */}
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <h4 className="font-bold text-lg capitalize">
                                      {item.name}
                                    </h4>
                                    
                                  </div>
                                </div>

                                {/* Nutrition Grid */}
                                <div className="gap-2 grid grid-cols-2">
                                  <div className="bg-background/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Flame className="w-4 h-4 text-orange-500" />
                                      <span className="font-medium text-muted-foreground text-xs">
                                        Calories
                                      </span>
                                    </div>
                                    <p className="font-bold text-lg">
                                      {item.calories_100g}
                                      <span className="ml-1 font-normal text-muted-foreground text-xs">
                                        kcal
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Apple className="w-4 h-4 text-red-500" />
                                      <span className="font-medium text-muted-foreground text-xs">
                                        Protein
                                      </span>
                                    </div>
                                    <p className="font-bold text-lg">
                                      {item.protein_100g}
                                      <span className="ml-1 font-normal text-muted-foreground text-xs">
                                        g
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Wheat className="w-4 h-4 text-amber-500" />
                                      <span className="font-medium text-muted-foreground text-xs">
                                        Carbs
                                      </span>
                                    </div>
                                    <p className="font-bold text-lg">
                                      {item.carbs_100g}
                                      <span className="ml-1 font-normal text-muted-foreground text-xs">
                                        g
                                      </span>
                                    </p>
                                  </div>

                                  <div className="bg-background/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Droplet className="w-4 h-4 text-blue-500" />
                                      <span className="font-medium text-muted-foreground text-xs">
                                        Fat
                                      </span>
                                    </div>
                                    <p className="font-bold text-lg">
                                      {item.fat_100g}
                                      <span className="ml-1 font-normal text-muted-foreground text-xs">
                                        g
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                {item.info && (
                                  <div className="space-y-1 bg-background/50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Info className="w-4 h-4 text-blue-500" />
                                      <span className="font-semibold text-xs">
                                        Nutritional Information
                                      </span>
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                      {item.info}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Note */}
                            {imageResponse[2]?.note && (
                              <div className="bg-muted/50 p-3 border border-dashed rounded-lg">
                                <p className="text-muted-foreground text-xs text-center">
                                  💡 {imageResponse[2].note}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* History Section */}
                        {!imagePreview && imageHistory.length > 0 && (
                          <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <History className="w-4 h-4" />
                              <h4 className="font-semibold text-sm">Recent Analyses</h4>
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
                                    className="flex items-center gap-3 bg-muted/50 hover:bg-muted p-3 border border-transparent hover:border-primary/20 rounded-lg w-full transition-colors"
                                  >
                                    <div className="flex-shrink-0 bg-background rounded-md w-16 h-16 overflow-hidden">
                                      <img
                                        src={analysis.imagePreview}
                                        alt="Previous analysis"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                      <p className="font-semibold text-sm truncate capitalize">
                                        {foodName}
                                      </p>
                                      <p className="text-muted-foreground text-xs">
                                        {totalItems} item(s) detected
                                      </p>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <p className="text-muted-foreground text-xs">
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
                <div className="p-3 border-t shrink-0">
                  {isAnalysisComplete ? (
                    <Button
                      onClick={clearImage}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 w-4 h-4" />
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
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 w-4 h-4" />
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
