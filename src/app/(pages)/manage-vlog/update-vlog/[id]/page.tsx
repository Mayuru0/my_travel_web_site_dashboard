"use client";
import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import UpdateVlog from '@/components/AdminPages/ManageVlog/UpdateVlog'
import React from 'react'

interface PageProps {
  params: { id: string };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = params;
  return (
    <AdminLayout>
      <UpdateVlog vlogId={id} />
    </AdminLayout>
  )
}

export default Page;
