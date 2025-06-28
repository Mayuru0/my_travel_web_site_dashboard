import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import AddGallery from '@/components/AdminPages/ManageGallery/AddGallery'

import React from 'react'

const page = () => {
  return (
    <AdminLayout>
        <AddGallery/>
    </AdminLayout>
  )
}

export default page
