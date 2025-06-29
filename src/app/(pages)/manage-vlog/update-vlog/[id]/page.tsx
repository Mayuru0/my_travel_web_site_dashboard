"use client";
import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import UpdateVlog from '@/components/AdminPages/ManageVlog/UpdateVlog'
import React, { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = use(params);
  
  return (
    <AdminLayout>
      <UpdateVlog vlogId={id} />
    </AdminLayout>
  )
}

export default Page;