import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import ManageGallery from '@/components/AdminPages/ManageGallery/ManageGallery'
import React from 'react'

const page = () => {
  return (
    <AdminLayout>
      <ManageGallery />
    </AdminLayout>
  )
}

export default page
