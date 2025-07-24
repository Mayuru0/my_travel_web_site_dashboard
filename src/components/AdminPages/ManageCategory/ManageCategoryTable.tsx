/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { deleteCategory, getCategories } from "@/lib/category";
import { CategoryType } from "@/types/CategoryType";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageCategoryTable = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [rawCategories, setRawCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setRawCategories(data as CategoryType[]);
      } catch (err) {
        toast.error("Failed to fetch categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


    console.log(rawCategories);

  useEffect(() => {
    const sorted = applySorting([...rawCategories], sortOption);
    setCategories(sorted);
  }, [rawCategories, sortOption]);

  const applySorting = (data: CategoryType[], sort: string) => {
    switch (sort) {
      case "name-asc":
        return data.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return data.sort((a, b) => b.title.localeCompare(a.title));
      case "date-asc":
  return data.sort(
    (a, b) =>
      a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime()
  );
default: // date-desc
  return data.sort(
    (a, b) =>
      b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
  );

    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      setRawCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/manage-category/update-category/${id}`);
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentItems = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 min-h-screen text-white">
   
      {/* Sort Dropdown */}
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-zinc-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-zinc-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {currentItems.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <div className="w-16 h-12 relative">
                    {category.coverImgUrl ? (
                      <Image
                        src={category.coverImgUrl}
                        alt="cover"
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="bg-zinc-700 w-full h-full rounded flex items-center justify-center text-xs">
                        No image
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{category.title}</td>
                <td className="px-4 py-3">{category.description}</td>
                <td className="px-4 py-3">
                 {category.createdAt ? category.createdAt.toDate().toLocaleString() : "No date"}

                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(category.id!)}
                    className="text-blue-400 hover:text-blue-600 "
                  >
                    <FiEdit className="h-5 w-5 cursor-pointer" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id!)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FiTrash2  className="h-5 w-5 cursor-pointer"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-zinc-800 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoryTable;
