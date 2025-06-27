import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";


const Custom404 = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <AlertTriangle
              size={80}
              className="animate-bounce text-red-500"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-8xl font-extrabold text-transparent">
            404
          </h1>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            Page Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            Oops! The page you&apos;re looking for seems to have wandered off
            into the digital wilderness.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
