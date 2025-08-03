"use client";

import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout';
import UpdateGallery from '@/components/AdminPages/ManageGallery/UpdateGallery';
import React from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== 'string') {
    return <div className="text-white p-6">Invalid Gallery ID</div>;
  }

  return (
    <AdminLayout>
      <UpdateGallery galleryId={id} />
    </AdminLayout>
  );
};

export default Page;
