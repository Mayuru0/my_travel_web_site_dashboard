import React from 'react';
import AdminSideBar from '../../../components/adminCommon/AdminSideBar';
import AdminHeader from '../../../components/adminCommon/AdminHeader';
import ProtectedRoute from '../../../components/Route/ProtectedRoute';



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
     <ProtectedRoute>
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="fixed md:static top-0 left-0 z-50 md:z-auto w-64 md:w-64 h-full">
        <AdminSideBar />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 sticky top-0 z-40 bg-slate-900 shadow-md">
          <AdminHeader />
        </header>

        {/* Scrollable main content */}
        <main className="flex-grow overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};


