"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaVideo, // ← imported instead of FaBook
  FaList,
  FaBed,
  FaUsers,
  FaComments,
  FaImages,
} from "react-icons/fa";
import { Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminuserTag from "./AdminuserTag";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const AdminSideBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const links: NavLink[] = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Manage Vlog", path: "/manage-vlog", icon: <FaVideo /> }, // ← video icon
    { name: "Manage Gallery", path: "/manage-gallery", icon: <FaImages /> },
    { name: "Users", path: "/users", icon: <FaUsers /> },
    { name: "Feedback", path: "/feedback", icon: <FaComments /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successfully");
      router.push("/"); 
    } catch (error: any) {
      console.error("Logout Error:", error.message);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-b rounded-tr-4xl from-gray-700 to-gray-900 gap-4 p-4 min-h-screen">
      {/* User Profile Section */}
      <div className="p-6 text-center border-b border-gray-900">
        <AdminuserTag />

        {/* Action Icons */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="text-white hover:bg-gray-900 rounded-xl p-2 cursor-pointer">
            <Bell size={24} /> {/* Increased from default */}
          </button>
          <button className="text-white hover:bg-gray-900 rounded-xl p-2 cursor-pointer">
            <Settings size={24} />
          </button>
          <button
          onClick={handleLogout}
          className="text-white hover:bg-gray-900 rounded-xl p-2 cursor-pointer">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Nav Links */}
      {links.map((link, idx) => {
        const isActive = pathname === link.path;
        return (
          <Link
            key={idx}
            href={link.path}
            className={`
              flex items-center gap-3  text-lg font-semibold px-4 py-2 rounded
              transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-white text-black scale-105"
                  : "text-white hover:bg-gray-600 hover:text-black hover:scale-105"
              }
            `}
          >
            <span className="text-2xl">{link.icon}</span>
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSideBar;
