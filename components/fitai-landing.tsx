"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  MessageSquare,
  Camera,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  Check,
  Star,
  Users,
  Trophy,
  Flame,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function FitAILanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Healthify
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="#features"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              About
            </Link>
            <ModeToggle />
            <Link href="/auth/signin" className={cn(buttonVariants())}>
              Get Started
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Drawer direction="bottom">
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-center">Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4 pb-8">
                  <DrawerClose asChild>
                    <Link
                      href="#features"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "w-full justify-start text-base",
                      )}
                    >
                      Features
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="#pricing"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "w-full justify-start text-base",
                      )}
                    >
                      Pricing
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="#about"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "w-full justify-start text-base",
                      )}
                    >
                      About
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/auth/signin"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full mt-4 shadow-sm",
                      )}
                    >
                      Get Started
                    </Link>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl opacity-30 dark:opacity-50" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl opacity-30 dark:opacity-50" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl opacity-30 dark:opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 shadow-sm">
            <Sparkles className="h-3 w-3 mr-2" />
            Your Personal AI Fitness Brain
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            Train smarter. Eat better.{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Get results
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Powered by AI that actually knows you. No generic plans. No
            guessing. Just data-driven fitness with an AI coach in your pocket.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-lg px-8 shadow-md hover:shadow-md transition-all group",
              )}
            >
              Get Started with Healthify
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-4 py-20 relative z-10"
      >
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            One platform. One brain. Zero confusion.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most fitness apps give you templates. Healthify gives you
            intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1: Exercise Plans */}
          <Card className="border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                Personalized Exercise Plans
              </CardTitle>
              <CardDescription className="text-sm">
                Built from your data. Updated as you change.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Based on your age, weight, and fitness level
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Adapts to your available equipment
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Plans evolve as your body improves
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: AI Chatbot */}
          <Card className="border hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">AI Chatbot Coach</CardTitle>
              <CardDescription className="text-sm">
                Ask anything. Anytime. Your 24/7 fitness assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Get workout explanations instantly
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Nutrition advice when you need it
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Motivation when you need a push
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Calorie Scanner */}
          <Card className="border hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                <Camera className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Calories from a Photo</CardTitle>
              <CardDescription className="text-sm">
                Just take a picture. fitAI does the math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Snap a photo of your meal
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Get instant calorie estimates
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  No scales or spreadsheets needed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-lg text-muted-foreground">
            Let AI do the thinking—so you can focus on showing up and getting
            stronger.
          </p>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-lg px-8 shadow-md hover:shadow-md transition-all group",
            )}
          >
            Get Started with Healthify
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="font-semibold bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Healthify
              </span>
              <span className="text-sm text-muted-foreground">
                - Your Personal AI Fitness Brain
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="#privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t">
            <p>&copy; 2026 Healthify. Built with AI for AI-powered fitness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
