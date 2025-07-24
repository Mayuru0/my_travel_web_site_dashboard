import AdminLayout from "@/app/(pages)/AdminLayout/adminLayout";
import UpdateCategory from "@/components/AdminPages/ManageCategory/UpdateCategory";

import React from "react";

interface PageProps {
  params: { id: string };
}

const Page: React.FC<PageProps> = ({ params }) => {
  return (
    <AdminLayout>
      <UpdateCategory categoryId={params.id} />
    </AdminLayout>
  );
};

export default Page;
