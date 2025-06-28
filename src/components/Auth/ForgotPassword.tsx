"use client";
import React, { useState } from "react";
import { sendResetEmail } from "@/lib/auth";
import toast from "react-hot-toast";
import Image from "next/image";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendResetEmail(email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      <Image
        src="/banner/2.JPG"
        alt="Background"
        fill
        className="w-full h-full object-cover absolute inset-0 z-0 scale-105 blur-[1px] transition duration-700"
      />

      {/* Back button */}
      
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center space-y-1 hover:scale-110 transition duration-300"
      >
        <MdKeyboardArrowLeft size={40} className="text-white" />
        <span className="text-white font-bold text-xl">Back</span>

      </Link>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl max-w-md bg-white/10 backdrop-blur-md border border-zinc-700 p-6 shadow-2xl shadow-violet-700/10 transition-all duration-300 hover:shadow-violet-500/20"
      >
        <h2 className="text-2xl mb-4 font-bold">Forgot Password</h2>
        <p className="mb-6 text-gray-200">
          Enter your email address and we will send you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold transition"
        >
          {isLoading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
}
