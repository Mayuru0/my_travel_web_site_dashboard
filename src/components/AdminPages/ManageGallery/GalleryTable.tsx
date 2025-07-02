"use client";

import { deleteGallery, getGalleries } from "@/lib/gallery";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const GalleryTable = () => {
   const router = useRouter();
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const itemsPerPage = 3;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!categoriesLoaded){
          const data = await getGalleries();
        setGalleryData(data);
          setCategoriesLoaded(true);
        } 
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        toast.error("Failed to fetch gallery.");  
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriesLoaded]);

  console.log(galleryData);
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = galleryData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete =  async (galleryId: string) => {
  const confirmed = confirm("Are you sure you want to delete this vlog?");
    if (confirmed) {
      try {
        await deleteGallery(galleryId);
        setGalleryData((prev) => prev.filter((v) => v.galleryId !== galleryId));
        toast.success("✅ Gallery deleted successfully!");
          setCategoriesLoaded(false);
        
      } catch (error) {
        console.error("❌ Failed to delete Gallery:", error);
        toast.error("❌ Failed to delete Gallery.");
      }
    }
  };

  const handleEdit = (galleryId: string) => {
    router.push(`/manage-gallery/update-gallery/${galleryId}`);
  };

  const openGalleryModal = (images: string[]) => {
    setModalImages(images);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
  };
  if (loading) return <div className="text-white p-6">Loading...</div>;
  return (
    <div className="p-6 min-h-screen  text-white">
      <h2 className="text-2xl font-bold mb-6">🖼 Travel Gallery</h2>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-zinc-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Cover Image</th>
              <th className="px-4 py-3">Title</th>
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
                  <Image
                    src={item.coverImgUrl}
                    alt={item.title}
                    width={200}
                    height={150}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  {item.title}
                </td>
                <td className="px-4 py-3">{item.province}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  {item.gallery && item.gallery.length > 0 ? (
                    <button
                      onClick={() => openGalleryModal(item.gallery)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      View Gallery ({item.gallery.length})
                    </button>
                  ) : (
                    <span className="text-gray-400">No images</span>
                  )}
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
                <Image
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="rounded object-cover"
                  width={200}
                  height={150}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ width: "100%", height: "auto" }}
                  priority={false}
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
