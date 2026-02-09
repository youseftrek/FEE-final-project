"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile/get");
        const result = await response.json();

        if (result.success) {
          setProfile(result.profile);
        } else {
          toast.error("Failed to load profile");
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error("Failed to load profile");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">
                Update your fitness profile information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic information and measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) =>
                        updateField("age", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height}
                      onChange={(e) =>
                        updateField("height", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight}
                      onChange={(e) =>
                        updateField("weight", Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => updateField("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Fitness Goals</CardTitle>
                <CardDescription>
                  Your fitness objectives and level
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center w-full gap-2">
                <div className="space-y-2 w-1/2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select
                    value={profile.goal}
                    onValueChange={(value) => updateField("goal", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="general-fitness">
                        General Fitness
                      </SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-1/2">
                  <Label htmlFor="level">Fitness Level</Label>
                  <Select
                    value={profile.level}
                    onValueChange={(value) => updateField("level", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Training Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Training Preferences</CardTitle>
                <CardDescription>
                  Where and how you prefer to train
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="place">Training Location</Label>
                  <Select
                    value={profile.place}
                    onValueChange={(value) => updateField("place", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days">Training Days per Week</Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="7"
                      value={profile.days}
                      onChange={(e) =>
                        updateField("days", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTime">Session Duration (min)</Label>
                    <Input
                      id="sessionTime"
                      type="number"
                      value={profile.sessionTime}
                      onChange={(e) =>
                        updateField("sessionTime", Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="able"
                      checked={profile.able}
                      onCheckedChange={(checked) =>
                        updateField("able", checked)
                      }
                    />
                    <Label
                      htmlFor="able"
                      className="font-normal cursor-pointer"
                    >
                      I am able to train without restrictions
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment & Health */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment & Health</CardTitle>
                <CardDescription>
                  Available equipment and any injuries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Equipment</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Dumbbells",
                      "Barbell",
                      "Resistance Bands",
                      "Pull-up Bar",
                      "Bench",
                      "Treadmill",
                      "Stationary Bike",
                      "No Equipment",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={profile.equipment?.includes(item) || false}
                          onCheckedChange={(checked) => {
                            const current = profile.equipment || [];
                            if (checked) {
                              updateField("equipment", [...current, item]);
                            } else {
                              updateField(
                                "equipment",
                                current.filter((i: string) => i !== item),
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Injuries (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Knee",
                      "Back",
                      "Shoulder",
                      "Wrist",
                      "Ankle",
                      "Hip",
                      "Elbow",
                      "None",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={profile.injures?.includes(item) || false}
                          onCheckedChange={(checked) => {
                            const current = profile.injures || [];
                            if (checked) {
                              updateField("injures", [...current, item]);
                            } else {
                              updateField(
                                "injures",
                                current.filter((i: string) => i !== item),
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="others">Additional Notes (Optional)</Label>
                  <Textarea
                    id="others"
                    value={
                      typeof profile.others === "object"
                        ? profile.others?.notes || ""
                        : profile.others || ""
                    }
                    onChange={(e) =>
                      updateField("others", { notes: e.target.value })
                    }
                    placeholder="Any other information about your fitness goals or limitations..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
