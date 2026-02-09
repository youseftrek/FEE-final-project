/**
 * EXAMPLE: How to use auth functions in your components
 * Delete this file after reading - it's just for reference
 */

"use client";

import { useEffect, useState } from "react";
import { logout, getSession, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

// Example 1: Using logout in a component
export function LogoutButton() {
  return (
    <Button onClick={logout} variant="outline">
      Logout
    </Button>
  );
}

// Example 2: Get current user and display info
export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getSession();
      setUser(currentUser);
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

// Example 3: Protected page - redirect if not authenticated
export function ProtectedPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        window.location.href = "/auth/signin";
        return;
      }
      const currentUser = await getSession();
      setUser(currentUser);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}

// Example 4: Direct API call to session endpoint
async function manualSessionCheck() {
  const response = await fetch("/api/session");
  const result = await response.json();

  if (result.success) {
    console.log("Current user:", result.user);
  } else {
    console.log("Not authenticated");
  }
}
