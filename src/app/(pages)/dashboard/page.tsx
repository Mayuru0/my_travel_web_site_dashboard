import AdminLayout from "@/components/adminCommon/adminLayout"
import Dashboard from "@/components/AdminPages/Dashboard"
import type React from "react"


const DashboardPage: React.FC = () => {
  

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  )
}

export default DashboardPage
