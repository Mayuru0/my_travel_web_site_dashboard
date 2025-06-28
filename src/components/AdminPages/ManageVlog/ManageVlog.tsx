"use client";
import React from "react";
import VlogTable from "./VlogTable";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
const ManageVlog = () => {

    const router = useRouter();
  return (
    <div className="p-6  min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white font-raleway">📹 All Vlogs</h1>
        <button
        onClick={() => router.push('/manage-vlog/add-vlog')}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition duration-200 shadow-sm hover:shadow-md cursor-pointer">
          <AiOutlinePlus className="text-lg" />
          <span>Add Vlog</span>
        </button>
      </div>

      <VlogTable />
    </div>
  );
};

export default ManageVlog;
