"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { getVlogById, updateVlog } from "@/lib/vlog";
import toast from "react-hot-toast";
import { Vlog } from "@/types/vlog";

interface UpdateVlogProps {
  vlogId: string;
}
const UpdateVlog: React.FC<UpdateVlogProps> = ({ vlogId }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<Vlog, "id" | "public_id">>({
    title: "",
    url: "",
    category: "",
    duration: "",
    description: "",
    thumbnailUrl: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!vlogId) return;

    async function fetchVlog() {
      try {
        const vlog = await getVlogById(vlogId);
        if (vlog) {
          setFormData({
            title: vlog.title,
            url: vlog.url,
            category: vlog.category,
            duration: vlog.duration,
            description: vlog.description,
            thumbnailUrl: vlog.thumbnailUrl,
          });
          setPreview(vlog.thumbnailUrl);
        }
      } catch (error) {
        toast.error("Failed to load vlog data.");
        console.error("Failed to load vlog data:", error);
      }
    }
    fetchVlog();
  }, [vlogId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.url) newErrors.url = "URL is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.thumbnailUrl && !thumbnailFile)
      newErrors.thumbnail = "Thumbnail is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      toast.loading("Updating vlog...");

      let updatedThumbnailUrl = formData.thumbnailUrl;

      if (thumbnailFile) {
        updatedThumbnailUrl = await uploadToCloudinary(thumbnailFile);
      }

      const updatedVlog: Vlog = {
        id: vlogId,
        title: formData.title,
        url: formData.url,
        category: formData.category,
        duration: formData.duration,
        description: formData.description,
        thumbnailUrl: updatedThumbnailUrl,
      };

      await updateVlog(updatedVlog);

      toast.dismiss();
      toast.success("🎉 Vlog updated successfully!");
      router.push("/manage-vlog");
    } catch (error: unknown) {
      toast.dismiss();
      if (error instanceof Error) {
        toast.error(error.message || "❌ Failed to update vlog");
      } else {
        toast.error("❌ Failed to update vlog");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center text-white text-lg font-bold mb-4 hover:underline cursor-pointer"
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl mx-auto bg-zinc-900 p-6 rounded-lg border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6">✏️ Update Vlog</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Thumbnail</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <Image
                  src={preview}
                  width={200}
                  height={140}
                  alt="Thumbnail Preview"
                  className="w-20 h-14 object-cover rounded border border-zinc-700"
                />
              ) : (
                <div className="w-20 h-14 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center text-zinc-400 text-sm">
                  No Image
                </div>
              )}
              <label className="text-sm bg-green-700 hover:bg-green-800 px-3 py-1 rounded cursor-pointer">
                Choose New Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block mb-1 font-medium">YouTube URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>

          {/* Category (Disabled) */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded opacity-70"
            >
              <option value="">Select a category</option>
              <option value="other">Other</option>
              <option value="vlog">Vlog</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>
          {/* Duration */}
          <div>
            <label className="block mb-1 font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 42:00"
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
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
              className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Update Vlog
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVlog;
