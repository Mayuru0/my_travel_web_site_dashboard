"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const GalleryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);

  const [galleryData, setGalleryData] = useState([
    {
      id: 1,
      name: "Anuradhapura",
      province: "North Central Province",
      coverImg:
        "https://source.unsplash.com/featured/?anuradhapura",
      description: "Ancient city with rich history.",
      gallery: [
        "https://source.unsplash.com/featured/?anuradhapura,temple",
        "https://source.unsplash.com/featured/?anuradhapura,lake",
        "https://source.unsplash.com/featured/?anuradhapura,ruins",
      ],
    },
    {
      id: 2,
      name: "Sigiriya",
      province: "North Central Province",
      coverImg: "https://source.unsplash.com/featured/?sigiriya",
      description: "Famous for the Lion Rock Fortress.",
      gallery: [
        "https://source.unsplash.com/featured/?sigiriya,rock",
        "https://source.unsplash.com/featured/?sigiriya,garden",
      ],
    },
    {
      id: 3,
      name: "Ella",
      province: "Uva Province",
      coverImg: "https://source.unsplash.com/featured/?ella",
      description: "Beautiful hill country with waterfalls.",
      gallery: [
        "https://source.unsplash.com/featured/?ella,waterfall",
        "https://source.unsplash.com/featured/?ella,hill",
        "https://source.unsplash.com/featured/?ella,tea",
      ],
    },
    // add more items as needed
  ]);

  const totalPages = Math.ceil(galleryData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = galleryData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this destination?");
    if (confirmed) {
      setGalleryData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit destination with ID: ${id}`);
  };

  const openGalleryModal = (images: string[]) => {
    setModalImages(images);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
  };

  return (
    <div className="p-6 min-h-screen  text-white">
      <h2 className="text-2xl font-bold mb-6">🖼 Travel Gallery</h2>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-zinc-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Cover Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3 max-w-xs">Description</th>
              <th className="px-4 py-3">Gallery</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-800 transition">
                <td className="px-4 py-3">
                  <img
                    src={item.coverImg}
                    alt={item.name}
                    className="rounded object-cover w-20 h-14"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                <td className="px-4 py-3">{item.province}</td>
                <td className="px-4 py-3 max-w-xs truncate">{item.description}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openGalleryModal(item.gallery)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    View Gallery ({item.gallery.length})
                  </button>
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-400 hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
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

      {/* Modal for gallery images */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-md  flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 p-6 rounded-lg max-w-5xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl mb-4">Gallery Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {modalImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="rounded object-cover w-full h-32"
                />
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTable;
