"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getVlogs } from "@/lib/vlog";
import { deleteVlog } from "@/lib/vlog";
import toast from "react-hot-toast";
import { Vlog } from "@/types/vlog";
import { useRouter } from "next/navigation";


const VlogTable = () => {
   const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [vlogs, setVlogs] = useState<Vlog[]>([]); // ✔️ Typed array

  useEffect(() => {
    const fetchVlogs = async () => {
      const fetched = await getVlogs();
      setVlogs(fetched);
    };

    fetchVlogs();
  }, []);

  const handleDelete = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this vlog?");
  if (confirmed) {
    try {
      await deleteVlog(id);
      setVlogs((prev) => prev.filter((v) => v.id !== id));
      toast.success("✅ Vlog deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete vlog:", error);
      toast.error("❌ Failed to delete vlog.");
    }
  }
};

  const handleEdit = (vlogId: string) => {
    router.push(`/manage-vlog/update-vlog/${vlogId}`);

  };

  const filteredVlogs =
    filter === "all" ? vlogs : vlogs.filter((v) => v.category === filter);

  const totalPages = Math.ceil(filteredVlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredVlogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🎥 Travel Vlogs</h2>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-zinc-800 text-white border border-zinc-700 px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="vlog">Vlog</option>
          <option value="cinematic">Cinematic</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-zinc-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Watch</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {currentItems.map((vlog) => (
              <tr key={vlog.id} className="hover:bg-zinc-800 transition">
                <td className="px-4 py-3">
                  <Image
                    src={vlog.thumbnailUrl}
                    width={200}
                    height={150}
                    alt="Thumbnail"
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-white">{vlog.title}</td>
                <td className="px-4 py-3 capitalize">{vlog.category}</td>
                <td className="px-4 py-3">{vlog.duration}</td>
                <td className="px-4 py-3">{vlog.description}</td>
                <td className="px-4 py-3">
                  <a
                    href={vlog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    Watch ▶
                  </a>
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(vlog.id!)}
                    className="text-blue-400 hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(vlog.id!)}
                    className="text-red-400 hover:text-red-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-zinc-500">
                  No vlogs found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-zinc-800 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 px-3 py-1 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VlogTable;
