import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import UpdateGallery from '@/components/AdminPages/ManageGallery/UpdateGallery'
import React from 'react'

interface PageProps {
  params: { id: string };
}

const Page: React.FC<PageProps> = ({ params }) => {
  return (
    <AdminLayout>
      <UpdateGallery galleryId={params.id} />
    </AdminLayout>
  );
};

export default Page;
