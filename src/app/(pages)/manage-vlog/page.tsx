import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import ManageVlog from '@/components/AdminPages/ManageVlog/ManageVlog'
import React from 'react'

const page = () => {
  return (
   <AdminLayout>
  <ManageVlog />
   </AdminLayout>
  )
}

export default page
