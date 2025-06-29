"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { login } from "@/lib/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    rememberMe: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500); // 1.5s splash
    return () => clearTimeout(timer);
  }, []);
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", rememberMe: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    // Optional: Remove this if "Remember me" is not mandatory
    if (!rememberMe) {
      newErrors.rememberMe = "Please check the 'Remember me' option";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
       await login(formData.email, formData.password);
      toast.success("Login successful!");
      router.push("/dashboard"); // Login success වෙලා redirect වෙන්න
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
        <Image
          src="/banner/2.JPG"
          alt="Login Background"
          fill
          className="w-full h-full object-cover absolute inset-0 z-0 scale-105 blur-[1px] transition duration-700"
        />
        <div className="flex justify-center items-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      <Image
        src="/banner/2.JPG"
        alt="Login Background"
        fill
        className="w-full h-full object-cover absolute inset-0 z-0 scale-105 blur-[1px] transition duration-700"
      />

      <div className="rounded-xl max-w-4xl bg-white/10 backdrop-blur-md border border-zinc-700 p-4 shadow-2xl shadow-violet-700/10 transition-all duration-300 hover:shadow-violet-500/20 mt-6 sm:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Side Image */}
          <div className="hidden md:flex items-center justify-center">
            <Image
              src="/banner/login.jpg"
              alt="Decorative"
              width={500}
              height={500}
              className="object-contain rounded-lg"
            />
          </div>

          {/* Right Side Form */}
          <div className="p-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-raleway">
                Welcome Back!
              </h1>
              <p className="text-sm sm:text-base font-kulim font-normal text-gray-200">
                Sign in to access your account and continue your journey with
                us.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="on"
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs sm:text-sm text-gray-400"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs sm:text-sm text-green-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {errors.rememberMe && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.rememberMe}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 rounded-lg hover:bg-green-600 text-white py-2 px-4 transition-colors duration-200 mt-2 text-sm sm:text-base flex items-center justify-center"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center text-xs sm:text-sm mt-4">
                <span className="text-gray-200">
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href="/auth/signup"
                  className="text-green-400 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
