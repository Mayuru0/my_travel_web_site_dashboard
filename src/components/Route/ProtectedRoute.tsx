"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to home if not authenticated
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Once loading is done and user is not present,
  // returning null to avoid UI flash since redirect is triggered
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
