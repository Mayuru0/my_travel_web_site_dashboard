import React from 'react'
import AdminSideBar from './AdminSideBar'
import AdminHeader from './AdminHeader'

type ProfileLayoutProps = {
    children: React.ReactNode
}

const AdminLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="w-full max-h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[15%] h-screen bg-gray-900 fixed top-0 left-0">
        <AdminSideBar />
      </div>

      {/* Main Content */}
      <div className="w-[85%] ml-[15%] bg-slate-900  text-white flex flex-col h-screen">
        {/* Header stays fixed at the top */}
        <div className="flex-shrink-0">
          <AdminHeader />
        </div>

        {/* Scrollable page content */}
        <main className="flex-grow overflow-y-auto p-5">
         {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
