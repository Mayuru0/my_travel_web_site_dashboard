import AdminLayout from '@/components/adminCommon/adminLayout'
import Users from '@/components/AdminPages/Users'
import React from 'react'

const page = () => {
  return (
   <AdminLayout>
    <div>
        <Users />
    </div>
   </AdminLayout>
  )
}

export default page
