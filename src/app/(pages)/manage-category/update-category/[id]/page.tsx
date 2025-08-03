"use client"; // ✅ Add this line

import AdminLayout from "@/app/(pages)/AdminLayout/adminLayout";
import UpdateCategory from "@/components/AdminPages/ManageCategory/UpdateCategory";
import React from "react";
import { useParams } from "next/navigation"; // ✅ Use client-side navigation

const Page = () => {
  const { id } = useParams(); // ✅ This gives you the route param in a client component

  if (!id || typeof id !== "string") {
    return <div className="text-white p-6">Invalid Category ID</div>;
  }

  return (
    <AdminLayout>
      <UpdateCategory categoryId={id} />
    </AdminLayout>
  );
};

export default Page;
