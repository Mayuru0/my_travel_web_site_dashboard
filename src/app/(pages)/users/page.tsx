import AdminLayout from '@/components/adminCommon/adminLayout'
import UsersTable from '@/components/AdminPages/ManageUsers/UsersTable'


import React from 'react'

const page = () => {
  return (
   <AdminLayout>
    <div>
        <UsersTable />
    </div>
   </AdminLayout>
  )
}

export default page
