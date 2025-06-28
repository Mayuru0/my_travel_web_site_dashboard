// hooks/useAuth.tsx (ตัวอย่าง)
"use client";

import { useEffect, useState } from "react";
import { onUserChanged } from "@/lib/auth"; 
import type { User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
