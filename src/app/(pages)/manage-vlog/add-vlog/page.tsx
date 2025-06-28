import AdminLayout from '@/app/(pages)/AdminLayout/adminLayout'
import AddVlog from '@/components/AdminPages/ManageVlog/AddVlog'
import React from 'react'

const page = () => {
  return (

    <AdminLayout>
        <div>
      <AddVlog />
    </div>
    </AdminLayout>
    
  )
}

export default page
