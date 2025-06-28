"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const VlogTable = () => {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [vlogs, setVlogs] = useState([
    {
      id: 1,
      title: "වෙල මැද පැලක රොටී හදලා කෑවා🍛🌾",
      thumbnail: "/thumbnail/wela.webp",
      url: "https://youtu.be/ImQpHYWog0s",
      category: "vlog",
      description: "මැද පැලක රොටී හදලා කෑවා",
      duration: "42:00",
    },
    {
      id: 2,
      title: "රිවස්ටන් වල නැරඹිය යුතුම ස්ථාන📸",
      thumbnail: "/thumbnail/Untitled-1.png",
      url: "https://youtu.be/K1UIHUqavuI",
      category: "cinematic",
      description: "Riverston වල බලන ඕනම තැන්වල්.",
      duration: "42:00",
    },
    {
      id: 3,
      title: "සිරිපා කරුණාව 2025🙏",
      thumbnail: "/thumbnail/11.png",
      url: "https://youtu.be/vl7f1mO7PLw",
      category: "vlog",
      description: "සිරිපා කරුණාව 2025 – පලාබද්දල මගී මාවත.",
      duration: "25:45",
    },
    {
      id: 4,
      title: "නුවරඑළිය සිට හෝර්ටන්තැන්නට 🥶❤",
      thumbnail: "/thumbnail/maxresdefault.webp",
      url: "https://youtu.be/VHekbVZAw98",
      category: "cinematic",
      description: "නුවරඑළියෙන් හෝර්ටන් තැන්න දක්වා.",
      duration: "44:22",
    },
    {
      id: 5,
      title: "Ella Waterfall Vlog",
      thumbnail: "/thumbnail/ella.jpg",
      url: "https://youtu.be/ella123",
      category: "vlog",
      description: "Exploring waterfalls in Ella.",
      duration: "32:10",
    },
  ]);

  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this vlog?");
    if (confirmed) {
      setVlogs((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit vlog with ID: ${id}`);
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

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to page 1 on filter change
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
                  <img
                    src={vlog.thumbnail}
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
                    onClick={() => handleEdit(vlog.id)}
                    className="text-blue-400 hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(vlog.id)}
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

      {/* Pagination Controls */}
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
