"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Image from "next/image";
import toast from "react-hot-toast";
import { createGallery } from "@/lib/gallery";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
const AddGallery = () => {
  const router = useRouter();

  // Store text fields normally
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    province: "",
    description: "",
  });

  // For images, store File or preview URLs
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null);

  // For gallery images: store array of Files and previews
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cover image file select and preview
  const handleCoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverImgFile(file);

    if (file) {
      setCoverImgPreview(URL.createObjectURL(file));
    } else {
      setCoverImgPreview(null);
    }
  };

  // Handle adding new gallery image input file
  const handleAddGalleryImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Update galleryFiles at index or add new
      setGalleryFiles((prev) => {
        const copy = [...prev];
        copy[index] = file;
        return copy;
      });
    }
  };

  // Add empty gallery image slot
  const addGalleryInput = () => {
    setGalleryFiles((prev) => [...prev, undefined as unknown as File]); // add empty placeholder
  };

  // Remove gallery image slot and preview at index
  const removeGalleryInput = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate previews for gallery files on files change
  useEffect(() => {
    const newPreviews = galleryFiles.map((file) =>
      file ? URL.createObjectURL(file) : ""
    );
    setGalleryPreviews(newPreviews);

    // Cleanup object URLs on unmount or change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.name = "Tiltle is required";
    if(!formData.date) newErrors.date = "Date is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!coverImgFile) newErrors.coverImg = "Cover image is required";
    if (galleryFiles.length === 0 || galleryFiles.some((file) => !file)) {
      newErrors.gallery = "All gallery images are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On submit, show the data in console
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let loadingToast;
    try {
      loadingToast = toast.loading("Uploading...");

      // Upload cover image
      const coverImgUrl = await uploadToCloudinary(coverImgFile as File);

      // Upload gallery images
      const galleryUrls = await Promise.all(
        galleryFiles.map((file) => uploadToCloudinary(file))
      );

      const newGalleryItem = {
        title: formData.title,
        date: formData.date,
        province: formData.province,
        description: formData.description,
        coverImgUrl,
        galleryUrls,
      };

      // Save to Firestore
      await createGallery(newGalleryItem);

      // Dismiss the loading toast first
      toast.dismiss(loadingToast);

      // Then show success message
      toast.success("Gallery item added!");

      // Reset form
      setFormData({ title: "",date: "", province: "", description: "" });
      setCoverImgFile(null);
      setCoverImgPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setErrors({});
    } catch (error) {
      console.error("Upload failed:", error);

      // Dismiss loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      // Show error message
      toast.error("Failed to add gallery");
    }
  };

  return (
    <div className="p-6 min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-white text-sm mb-4 hover:underline cursor-pointer"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl mx-auto  p-6 rounded-lg border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6">🖼 Add New Gallery Item</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full  border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label className="block mb-1 font-medium">Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
            >
              <option value="">Select a province</option>
              <option value="Central Province">Central Province</option>
              <option value="Eastern Province">Eastern Province</option>
              <option value="Northern Province">Northern Province</option>
              <option value="North Central Province">
                North Central Province
              </option>
              <option value="North Western Province">
                North Western Province
              </option>
              <option value="Sabaragamuwa Province">
                Sabaragamuwa Province
              </option>
              <option value="Southern Province">Southern Province</option>
              <option value="Uva Province">Uva Province</option>
              <option value="Western Province">Western Province</option>
            </select>

            {errors.province && (
              <p className="text-red-500 text-sm mt-1">{errors.province}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full  border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImgChange}
              className="text-white"
            />
            {coverImgPreview && (
              <Image
                src={coverImgPreview}
                width={200}
                height={150}
                alt="Cover preview"
                className="mt-2 w-40 h-28 object-cover rounded border border-zinc-700"
              />
            )}
            {errors.coverImg && (
              <p className="text-red-500 text-sm mt-1">{errors.coverImg}</p>
            )}
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block mb-1 font-medium">Gallery Images</label>
            {galleryFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddGalleryImage(e, index)}
                  className="text-white"
                />
                {galleryPreviews[index] && (
                  <Image
                    src={galleryPreviews[index]}
                    width={200}
                    height={150}
                    alt={`Gallery preview ${index + 1}`}
                    className="w-24 h-16 object-cover rounded border border-zinc-700"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeGalleryInput(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryInput}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            >
              + Add another image
            </button>
            {errors.gallery && (
              <p className="text-red-500 text-sm mt-1">{errors.gallery}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Add Gallery
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGallery;
