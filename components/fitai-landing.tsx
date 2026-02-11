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
    <div className="bg-gradient-to-b from-background via-background to-primary/5 min-h-screen">
      {/* Navigation */}
      <nav className="top-0 right-0 left-0 z-50 fixed bg-background/80 supports-[backdrop-filter]:bg-background/60 shadow-sm backdrop-blur-xl border-b">
        <div className="flex justify-between items-center mx-auto px-4 h-16 container">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-orange-500 font-bold text-transparent text-2xl">
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
            <ModeToggle />
            <Link href="/auth/signin" className={cn(buttonVariants())}>
              Get Started
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Drawer direction="bottom">
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
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
        <div className="top-20 left-10 absolute bg-primary/10 dark:bg-primary/20 opacity-30 dark:opacity-50 blur-3xl rounded-full w-72 h-72" />
        <div className="top-40 right-10 absolute bg-purple-500/10 dark:bg-purple-500/20 opacity-30 dark:opacity-50 blur-3xl rounded-full w-96 h-96" />
        <div className="bottom-20 left-1/3 absolute bg-orange-500/10 dark:bg-orange-500/20 opacity-30 dark:opacity-50 blur-3xl rounded-full w-80 h-80" />
      </div>

      {/* Hero Section */}
      <section className="z-10 relative mx-auto px-4 py-20 md:py-32 container">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge variant="secondary" className="shadow-sm px-4 py-1.5">
            <Sparkles className="mr-2 w-3 h-3" />
            Your Personal AI Fitness Brain
          </Badge>

          <h1 className="max-w-4xl font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight">
            Train smarter. Eat better.{" "}
            <span className="bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-orange-500 text-transparent">
              Get results
            </span>
          </h1>

          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl">
            Powered by AI that actually knows you. No generic plans. No
            guessing. Just data-driven fitness with an AI coach in your pocket.
          </p>

          <div className="flex sm:flex-row flex-col gap-4 pt-4">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-lg px-8 shadow-md hover:shadow-md transition-all group",
              )}
            >
              Get Started with Healthify
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="z-10 relative mx-auto px-4 py-20 container"
      >
        <div className="space-y-3 mb-12 text-center">
          <h2 className="font-bold text-3xl md:text-4xl">
            One platform. One brain. Zero confusion.
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Most fitness apps give you templates. Healthify gives you
            intelligence.
          </p>
        </div>

        <div className="gap-6 grid md:grid-cols-3 mx-auto max-w-5xl">
          {/* Feature 1: Exercise Plans */}
          <Card className="border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-center items-center bg-primary/10 mb-3 rounded-lg w-12 h-12">
                <Dumbbell className="w-6 h-6 text-primary" />
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
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  Based on your age, weight, and fitness level
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  Adapts to your available equipment
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  Plans evolve as your body improves
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: AI Chatbot */}
          <Card className="border hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-center items-center bg-purple-500/10 mb-3 rounded-lg w-12 h-12">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">AI Chatbot Coach</CardTitle>
              <CardDescription className="text-sm">
                Ask anything. Anytime. Your 24/7 fitness assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-purple-600" />
                <span className="text-muted-foreground text-sm">
                  Get workout explanations instantly
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-purple-600" />
                <span className="text-muted-foreground text-sm">
                  Nutrition advice when you need it
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-purple-600" />
                <span className="text-muted-foreground text-sm">
                  Motivation when you need a push
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Calorie Scanner */}
          <Card className="border hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-center items-center bg-orange-500/10 mb-3 rounded-lg w-12 h-12">
                <Camera className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Calories from a Photo</CardTitle>
              <CardDescription className="text-sm">
                Just take a picture. fitAI does the math.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-orange-600" />
                <span className="text-muted-foreground text-sm">
                  Snap a photo of your meal
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-orange-600" />
                <span className="text-muted-foreground text-sm">
                  Get instant calorie estimates
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="flex-shrink-0 mt-0.5 w-4 h-4 text-orange-600" />
                <span className="text-muted-foreground text-sm">
                  No scales or spreadsheets needed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="z-10 relative mx-auto px-4 py-20 container">
        <div className="space-y-6 mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-3xl md:text-4xl">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-muted-foreground text-lg">
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
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="z-10 relative bg-muted/30 backdrop-blur-xl border-t">
        <div className="mx-auto px-4 py-8 container">
          <div className="flex md:flex-row flex-col justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <span className="bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-orange-500 font-semibold text-transparent">
                Healthify
              </span>
              <span className="text-muted-foreground text-sm">
                - Your Personal AI Fitness Brain
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
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
          <div className="mt-4 pt-4 border-t text-muted-foreground text-sm text-center">
            <p>&copy; 2026 Healthify. Built with AI for AI-powered fitness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
