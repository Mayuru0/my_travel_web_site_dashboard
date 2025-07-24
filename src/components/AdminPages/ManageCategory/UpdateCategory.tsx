"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategoryById, updateCategory } from "@/lib/category";
import { CategoryType } from "@/types/CategoryType";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
import { uploadGalleryImageToCloudinary } from "@/lib/uploadToCloudinary"; // Your upload helper
import { MdKeyboardArrowLeft } from "react-icons/md";
interface UpdateCategoryProps {
  categoryId: string;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ categoryId }) => {
  const router = useRouter();

  // Form data (excluding image file)
  const [formData, setFormData] = useState({
    name: "",
    province: "",
    description: "",
  });

  // Store current cover image URL or newly selected file
  const [coverImg, setCoverImg] = useState<File | string | null>(null);

  // Preview URL for the image preview
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null);

  const [createdAt, setCreatedAt] = useState<Timestamp | null>(null);

  // Load category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        const data = await getCategoryById(categoryId);
        if (data) {
          setFormData({
            name: data.title,
            province: data.province,
            description: data.description,
          });
          setCoverImg(data.coverImgUrl);
          setCreatedAt(data.createdAt); // preserve original createdAt
        }
      } catch (error) {
        toast.error("Failed to load category");
      }
    };
    fetchCategory();
  }, [categoryId]);

  // Generate preview URL when coverImg changes
  useEffect(() => {
    if (!coverImg) {
      setCoverImgPreview(null);
      return;
    }

    if (typeof coverImg === "string") {
      // If it's a URL string
      setCoverImgPreview(coverImg);
      return;
    }

    // If it's a File object, create a blob URL
    const url = URL.createObjectURL(coverImg);
    setCoverImgPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [coverImg]);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new cover image selection
  const handleCoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setCoverImg(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    if (!formData.name || !formData.description || !coverImg) {
      toast.error("Please fill all fields and select a cover image");
      return;
    }

    if (!createdAt) {
      toast.error("Missing creation date");
      return;
    }

    try {
      toast.loading("Updating category...", { id: "updateCat" });

      // Upload image if coverImg is a File, otherwise keep existing URL
      let coverImgUrl = "";
      if (typeof coverImg === "string") {
        coverImgUrl = coverImg;
      } else {
        coverImgUrl = await uploadGalleryImageToCloudinary(coverImg);
      }

      const updatedCategory: CategoryType = {
        id: categoryId,
        title: formData.name,
        province: formData.province,
        description: formData.description,
        coverImgUrl,
        createdAt,
      };

      await updateCategory(updatedCategory);

      toast.success("Category updated successfully", { id: "updateCat" });
      router.push("/manage-category");
    } catch (error) {
      toast.error("Failed to update category", { id: "updateCat" });
      console.error(error);
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
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Update Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Province</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImgChange}
            className="w-full"
          />
          {coverImgPreview && (
            <img
              src={coverImgPreview}
              alt="Cover preview"
              className="mt-2 w-full max-h-60 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          Update
        </button>
      </form>
    </div>
    </div>
  );
};

export default UpdateCategory;
