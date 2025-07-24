"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlinePlus } from 'react-icons/ai'
import ManageCategoryTable from './ManageCategoryTable'


const ManageCategory = () => {
  const router = useRouter()

  return (
    <div className="p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white font-raleway">📁 Manage Categories</h1>
        <button
          onClick={() => router.push('/manage-category/add-categories')}
          className="flex cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition duration-200 shadow-sm hover:shadow-md"
        >
          <AiOutlinePlus className="text-lg" />
          <span>Add Category Item</span>
        </button>
      </div>

      <ManageCategoryTable />
    </div>
  )
}

export default ManageCategory
