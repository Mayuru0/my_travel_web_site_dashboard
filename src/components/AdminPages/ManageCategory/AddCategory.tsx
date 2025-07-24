"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Image from "next/image";
import { uploadGalleryCategoriesToCloudinary } from "@/lib/uploadToCloudinary";
import { createCategory } from "@/lib/category";
import { CategoryType } from "@/types/CategoryType";

const AddCategory = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    province: "",
    description: "",
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverImageFile(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
    else setCoverPreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Name is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!coverImageFile) newErrors.cover = "Cover image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let loadingToast;
    try {
      loadingToast = toast.loading("Uploading...");

      const coverImgUrl = await uploadGalleryCategoriesToCloudinary(coverImageFile as File);

      const newCategory = {
        title: formData.title,
        province: formData.province,
        description: formData.description,
        coverImgUrl,
      };

      await createCategory(newCategory as CategoryType);

      toast.dismiss(loadingToast);
      toast.success("Category created successfully!");
      setFormData({ title: "", province: "", description: "" });
      setCoverImageFile(null);
      setCoverPreview(null);
      setErrors({});
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center text-white text-sm mb-4 hover:underline cursor-pointer"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-xl mx-auto border border-zinc-700 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">📂 Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-zinc-700  text-white"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

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
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-zinc-700  text-white"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="text-white"
            />
            {coverPreview && (
              <Image
                src={coverPreview}
                width={200}
                height={150}
                alt="Cover Preview"
                className="mt-2 w-40 h-28 object-cover border border-zinc-700 rounded"
              />
            )}
            {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer" 
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
