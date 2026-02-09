"use client";

import { toast } from "sonner";

/**
 * Logout the current user
 */
export async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    const result = await response.json();

    if (result.success) {
      toast.success("Logged out successfully");
      // Redirect to sign in page
      window.location.href = "/auth/signin";
    } else {
      toast.error("Logout failed", {
        description: result.message,
      });
    }
  } catch (error) {
    toast.error("Logout failed", {
      description: "An error occurred. Please try again.",
    });
  }
}

/**
 * Get the current user session
 */
export async function getSession() {
  try {
    const response = await fetch("/api/session");
    const result = await response.json();

    if (result.success) {
      return result.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getSession();
  return user !== null;
}

/**
 * Check if user has completed their profile
 */
export async function hasCompletedProfile() {
  try {
    const response = await fetch("/api/profile/get");
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Failed to check profile:", error);
    return false;
  }
}
