import AdminLayout from '@/app/components/adminCommon/adminLayout'
import Users from '@/app/components/AdminPages/Users'
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
