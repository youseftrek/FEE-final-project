"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Target,
  TrendingUp,
  Flame,
  Zap,
  Award,
  Home,
  Building2,
  Trees,
  Shuffle,
  User,
  Users,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  age: z
    .number()
    .min(13, "Must be at least 13 years old")
    .max(100, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  height: z
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Invalid height"),
  weight: z
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Invalid weight"),
  goal: z.string().min(1, "Please select a goal"),
  level: z.string().min(1, "Please select your fitness level"),
  place: z.string().min(1, "Please select where you train"),
  able: z.boolean(),
  days: z.number().min(1, "At least 1 day").max(7, "Maximum 7 days"),
  sessionTime: z
    .number()
    .min(15, "At least 15 minutes")
    .max(300, "Maximum 300 minutes"),
  equipment: z.array(z.string()).min(1, "Select at least one option"),
  injuries: z.array(z.string()).optional(),
  others: z.string().optional(),
});

const equipmentOptions = [
  {
    value: "Dumbbells",
    label: "Dumbbells",
    icon: Dumbbell,
    description: "Free weights for versatile training",
  },
  {
    value: "Barbell",
    label: "Barbell",
    icon: Dumbbell,
    description: "Heavy lifting equipment",
  },
  {
    value: "Resistance Bands",
    label: "Resistance Bands",
    icon: Target,
    description: "Portable resistance training",
  },
  {
    value: "Pull-up Bar",
    label: "Pull-up Bar",
    icon: TrendingUp,
    description: "Upper body strength",
  },
  {
    value: "Bench",
    label: "Bench",
    icon: Award,
    description: "For press exercises",
  },
  {
    value: "Treadmill",
    label: "Treadmill",
    icon: TrendingUp,
    description: "Cardio machine",
  },
  {
    value: "Stationary Bike",
    label: "Stationary Bike",
    icon: Target,
    description: "Low-impact cardio",
  },
  {
    value: "No Equipment",
    label: "No Equipment",
    icon: Home,
    description: "Bodyweight exercises only",
  },
];

const injuryOptions = [
  { value: "Knee", label: "Knee", description: "Knee pain or injury" },
  { value: "Back", label: "Back", description: "Lower or upper back issues" },
  { value: "Shoulder", label: "Shoulder", description: "Shoulder problems" },
  { value: "Wrist", label: "Wrist", description: "Wrist pain or weakness" },
  { value: "Ankle", label: "Ankle", description: "Ankle issues" },
  { value: "Hip", label: "Hip", description: "Hip pain or mobility" },
  { value: "Elbow", label: "Elbow", description: "Elbow discomfort" },
  { value: "None", label: "None", description: "No injuries" },
];

export default function CompleteProfilePage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const totalSteps = 5;

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched", // Only show errors after user touches the field
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      gender: "male",
      height: 0,
      weight: 0,
      goal: "",
      level: "",
      place: "",
      able: true,
      days: 3,
      sessionTime: 60,
      equipment: [],
      injuries: [],
      others: "",
    },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          goal: data.goal,
          level: data.level,
          place: data.place,
          able: data.able,
          days: data.days,
          sessionTime: data.sessionTime,
          equipment: data.equipment,
          injures: data.injuries,
          others: data.others ? { notes: data.others } : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile completed!", {
          description: "Your profile has been saved successfully.",
        });
        window.location.href = "/dashboard";
      } else {
        toast.error("Profile save failed", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Profile save failed", {
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "age", "gender"];
      case 2:
        return ["height", "weight"];
      case 3:
        return ["goal", "level"];
      case 4:
        return ["place", "days", "sessionTime", "able"];
      case 5:
        return ["equipment", "injuries", "others"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Healthify
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}
            </CardDescription>
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Personal Information
                    </h3>
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>First Name</FieldLabel>
                          <Input {...field} placeholder="John" />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Last Name</FieldLabel>
                          <Input {...field} placeholder="Doe" />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="age"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Age</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="25"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Gender</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </>
                )}

                {/* Step 2: Physical Metrics */}
                {currentStep === 2 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Physical Metrics
                    </h3>
                    <Controller
                      name="height"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Height (cm)</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="170"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="weight"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Weight (kg)</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="70"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </>
                )}

                {/* Step 3: Fitness Goals */}
                {currentStep === 3 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Fitness Goals & Level
                    </h3>
                    <Controller
                      name="goal"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Primary Goal</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <label
                                htmlFor="goal-weight-loss"
                                className={cn(
                                  "flex flex-col gap-2 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "weight-loss" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="weight-loss"
                                    id="goal-weight-loss"
                                  />
                                  <Flame className="h-5 w-5 text-primary" />
                                  <span className="font-medium">
                                    Weight Loss
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-10">
                                  Burn fat and achieve your ideal weight
                                </p>
                              </label>

                              <label
                                htmlFor="goal-muscle-gain"
                                className={cn(
                                  "flex flex-col gap-2 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "muscle-gain" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="muscle-gain"
                                    id="goal-muscle-gain"
                                  />
                                  <Dumbbell className="h-5 w-5 text-primary" />
                                  <span className="font-medium">
                                    Muscle Gain
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-10">
                                  Build muscle mass and strength
                                </p>
                              </label>

                              <label
                                htmlFor="goal-general-fitness"
                                className={cn(
                                  "flex flex-col gap-2 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "general-fitness" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="general-fitness"
                                    id="goal-general-fitness"
                                  />
                                  <Sparkles className="h-5 w-5 text-primary" />
                                  <span className="font-medium">
                                    General Fitness
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-10">
                                  Stay active and healthy overall
                                </p>
                              </label>

                              <label
                                htmlFor="goal-strength"
                                className={cn(
                                  "flex flex-col gap-2 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "strength" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="strength"
                                    id="goal-strength"
                                  />
                                  <Zap className="h-5 w-5 text-primary" />
                                  <span className="font-medium">Strength</span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-10">
                                  Maximize your power and strength
                                </p>
                              </label>

                              <label
                                htmlFor="goal-endurance"
                                className={cn(
                                  "flex flex-col gap-2 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "endurance" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <RadioGroupItem
                                    value="endurance"
                                    id="goal-endurance"
                                  />
                                  <TrendingUp className="h-5 w-5 text-primary" />
                                  <span className="font-medium">Endurance</span>
                                </div>
                                <p className="text-xs text-muted-foreground ml-10">
                                  Improve stamina and cardio fitness
                                </p>
                              </label>
                            </div>
                          </RadioGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="level"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Fitness Level</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="grid grid-cols-1 gap-3">
                              <label
                                htmlFor="level-beginner"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "beginner" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem
                                  value="beginner"
                                  id="level-beginner"
                                />
                                <User className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Beginner</div>
                                  <p className="text-xs text-muted-foreground">
                                    Just starting your fitness journey
                                  </p>
                                </div>
                              </label>

                              <label
                                htmlFor="level-intermediate"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "intermediate" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem
                                  value="intermediate"
                                  id="level-intermediate"
                                />
                                <Users className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    Intermediate
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Regular training with some experience
                                  </p>
                                </div>
                              </label>

                              <label
                                htmlFor="level-advanced"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "advanced" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem
                                  value="advanced"
                                  id="level-advanced"
                                />
                                <Award className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Advanced</div>
                                  <p className="text-xs text-muted-foreground">
                                    Experienced athlete with years of training
                                  </p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </>
                )}

                {/* Step 4: Training Preferences */}
                {currentStep === 4 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Training Preferences
                    </h3>
                    <Controller
                      name="place"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Where do you train?</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <label
                                htmlFor="place-gym"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "gym" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem value="gym" id="place-gym" />
                                <Building2 className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Gym</div>
                                  <p className="text-xs text-muted-foreground">
                                    Full equipment access
                                  </p>
                                </div>
                              </label>

                              <label
                                htmlFor="place-home"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "home" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem value="home" id="place-home" />
                                <Home className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Home</div>
                                  <p className="text-xs text-muted-foreground">
                                    Train at your convenience
                                  </p>
                                </div>
                              </label>

                              <label
                                htmlFor="place-outdoor"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "outdoor" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem
                                  value="outdoor"
                                  id="place-outdoor"
                                />
                                <Trees className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Outdoor</div>
                                  <p className="text-xs text-muted-foreground">
                                    Parks and open spaces
                                  </p>
                                </div>
                              </label>

                              <label
                                htmlFor="place-hybrid"
                                className={cn(
                                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value === "hybrid" &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <RadioGroupItem
                                  value="hybrid"
                                  id="place-hybrid"
                                />
                                <Shuffle className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                  <div className="font-medium">Hybrid</div>
                                  <p className="text-xs text-muted-foreground">
                                    Mix of locations
                                  </p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="days"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Training Days per Week</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="7"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="sessionTime"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Session Duration (minutes)</FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="60"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="able"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="able"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="able"
                              className="text-sm font-medium"
                            >
                              I am able to train without restrictions
                            </label>
                          </div>
                        </Field>
                      )}
                    />
                  </>
                )}

                {/* Step 5: Equipment & Health */}
                {currentStep === 5 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Equipment & Health
                    </h3>
                    <Controller
                      name="equipment"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>
                            Available Equipment (Select all that apply)
                          </FieldLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {equipmentOptions.map((item) => {
                              const Icon = item.icon;
                              return (
                                <label
                                  key={item.value}
                                  htmlFor={`equipment-${item.value}`}
                                  className={cn(
                                    "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                    field.value?.includes(item.value) &&
                                      "border-primary bg-primary/5",
                                  )}
                                >
                                  <Checkbox
                                    id={`equipment-${item.value}`}
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([
                                          ...current,
                                          item.value,
                                        ]);
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            (i) => i !== item.value,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                  <Icon className="h-4 w-4 text-primary shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs truncate">
                                      {item.label}
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="injuries"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Any Injuries? (Optional)</FieldLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {injuryOptions.map((item) => (
                              <label
                                key={item.value}
                                htmlFor={`injury-${item.value}`}
                                className={cn(
                                  "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all hover:border-primary",
                                  field.value?.includes(item.value) &&
                                    "border-primary bg-primary/5",
                                )}
                              >
                                <Checkbox
                                  id={`injury-${item.value}`}
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, item.value]);
                                    } else {
                                      field.onChange(
                                        current.filter((i) => i !== item.value),
                                      );
                                    }
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs truncate">
                                    {item.label}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </Field>
                      )}
                    />
                    <Controller
                      name="others"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Additional Notes (Optional)</FieldLabel>
                          <Input
                            {...field}
                            placeholder="Any other information..."
                          />
                        </Field>
                      )}
                    />
                  </>
                )}
              </FieldGroup>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
