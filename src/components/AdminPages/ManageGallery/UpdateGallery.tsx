"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MdKeyboardArrowLeft } from "react-icons/md"
import Image from "next/image"
import toast from "react-hot-toast"
import { getGalleryById, updateGallery } from "@/lib/gallery"
import { uploadGalleryImageToCloudinary } from "@/lib/uploadToCloudinary"
import type { galleryType } from "@/types/gallery"
import type { CategoryType } from "@/types/CategoryType"
import { getCategories } from "@/lib/category"

interface UpdateGalleryProps {
  galleryId: string
}

const UpdateGallery: React.FC<UpdateGalleryProps> = ({ galleryId }) => {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [formData, setFormData] = useState({
    categoryId: "",
    date: "",
    province: "",
    description: "",
    subtitle: "",
  })

  const [coverImg, setCoverImg] = useState<File | string | null>(null)
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null)
  const [galleryImgs, setGalleryImgs] = useState<(File | string | null)[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Progress tracking
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        toast.error("Failed to load categories")
      }
    }
    fetchCats()
  }, [])

  // Fetch existing gallery after categories loaded
  useEffect(() => {
    if (!galleryId || categories.length === 0) return
    const fetchData = async () => {
      try {
        const data = await getGalleryById(galleryId)
        if (!data) {
          toast.error("Gallery not found")
          return
        }
        const matchedCat = categories.find((cat) => cat.title === data.title)
        setFormData({
          categoryId: matchedCat?.id || "",
          subtitle: data.subtitle,
          date: data.date,
          province: data.province,
          description: data.description,
        })
        setCoverImg(data.coverImgUrl)
        setCoverImgPreview(data.coverImgUrl)
        setGalleryImgs(data.galleryUrls)
        setGalleryPreviews(data.galleryUrls)
      } catch (err) {
        toast.error("Failed to load gallery data")
        console.error(err)
      }
    }
    fetchData()
  }, [galleryId, categories])

  // Cover image preview
  useEffect(() => {
    if (coverImg && typeof coverImg !== "string") {
      const url = URL.createObjectURL(coverImg)
      setCoverImgPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (typeof coverImg === "string") {
      setCoverImgPreview(coverImg)
    } else {
      setCoverImgPreview(null)
    }
  }, [coverImg])

  // Gallery image previews
  useEffect(() => {
    const previews = galleryImgs
      .map((img) => {
        if (typeof img === "string") return img
        if (img instanceof File) return URL.createObjectURL(img)
        return ""
      })
      .filter(Boolean) // Filter out empty strings
    setGalleryPreviews(previews)
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url)
      })
    }
  }, [galleryImgs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) setCoverImg(file)
  }

  const handleGalleryImgChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    setGalleryImgs((prev) => {
      const copy = [...prev]
      copy[index] = file
      return copy
    })
  }

  const addGalleryInput = () => {
    setGalleryImgs((prev) => [...prev, null])
  }

  const removeGalleryInput = (index: number) => {
    setGalleryImgs((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.categoryId) newErrors.categoryId = "Category selection is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.province) newErrors.province = "Province is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!coverImg) newErrors.coverImg = "Cover image is required"
    if (galleryImgs.length === 0 || galleryImgs.some((img) => !img)) {
      newErrors.gallery = "All gallery images are required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Progress Bar Component
  const ProgressBar = () => {
    if (!isUpdating) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#0F172B] border border-zinc-700 rounded-lg p-6 w-96">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Updating Gallery...</h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{currentStep}</span>
              <span>{updateProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${updateProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">Please wait while we update your gallery...</div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !galleryId) return

    setIsUpdating(true)
    setUpdateProgress(0)

    try {
      // Step 1: Check and upload cover image if needed (0-25%)
      setCurrentStep("Processing cover image...")
      setUpdateProgress(5)

      const coverImgUrl =
        typeof coverImg === "string" ? coverImg : await uploadGalleryImageToCloudinary(coverImg as File)
      setUpdateProgress(25)

      // Step 2: Process gallery images (25-75%)
      setCurrentStep("Processing gallery images...")
      const totalGalleryImages = galleryImgs.length
      const galleryUrls: string[] = []

      for (let i = 0; i < galleryImgs.length; i++) {
        const img = galleryImgs[i]
        let url: string

        if (typeof img === "string") {
          // Existing image, no upload needed
          url = img
        } else if (img instanceof File) {
          // New image, needs upload
          url = await uploadGalleryImageToCloudinary(img)
        } else {
          url = ""
        }

        if (url) galleryUrls.push(url)

        // Update progress for each gallery image
        const progressPerImage = 50 / totalGalleryImages // 50% total for gallery images
        const currentProgress = 25 + progressPerImage * (i + 1)
        setUpdateProgress(Math.round(currentProgress))
      }

      // Step 3: Update database (75-100%)
      setCurrentStep("Saving changes...")
      setUpdateProgress(80)

      const selectedCategory = categories.find((cat) => cat.id === formData.categoryId)

      const updatedGallery: galleryType = {
        id: galleryId,
        title: selectedCategory?.title || "",
        subtitle: formData.subtitle || "",
        date: formData.date,
        province: formData.province,
        description: formData.description,
        coverImgUrl,
        galleryUrls: galleryUrls.filter(Boolean),
      }

      await updateGallery(updatedGallery)

      setUpdateProgress(100)
      setCurrentStep("Complete!")

      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success("Gallery updated successfully!")

      setTimeout(() => {
        router.push("/manage-gallery")
      }, 1500)
    } catch (err) {
      toast.error("Failed to update gallery")
      console.error(err)
    } finally {
      setIsUpdating(false)
      setUpdateProgress(0)
      setCurrentStep("")
    }
  }

  return (
    <div className="p-6 min-h-screen text-white">
      {/* Progress Bar Overlay */}
      <ProgressBar />

      <button
        onClick={() => router.back()}
        className="flex items-center text-white text-sm mb-4 hover:underline cursor-pointer"
        disabled={isUpdating}
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl mx-auto p-6 rounded-lg border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6">✏️ Update Gallery Item</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              disabled={isUpdating}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
          </div>

          {/* Subtitle (optional) */}
          <div>
            <label className="block mb-1 font-medium">Subtitle (optional)</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              placeholder="Enter subtitle"
              disabled={isUpdating}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              disabled={isUpdating}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Province */}
          <div>
            <label className="block mb-1 font-medium">Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              disabled={isUpdating}
            >
              <option value="">Select a province</option>
              <option value="Central Province">Central Province</option>
              <option value="Eastern Province">Eastern Province</option>
              <option value="Northern Province">Northern Province</option>
              <option value="North Central Province">North Central Province</option>
              <option value="North Western Province">North Western Province</option>
              <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
              <option value="Southern Province">Southern Province</option>
              <option value="Uva Province">Uva Province</option>
              <option value="Western Province">Western Province</option>
            </select>
            {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              disabled={isUpdating}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImgChange}
              className="text-white"
              disabled={isUpdating}
            />
            {coverImgPreview && (
              <Image
                src={coverImgPreview || "/placeholder.svg"}
                width={200}
                height={150}
                alt="Cover preview"
                className="mt-2 w-40 h-28 object-cover rounded border border-zinc-700"
              />
            )}
            {errors.coverImg && <p className="text-red-500 text-sm">{errors.coverImg}</p>}
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block mb-1 font-medium">Gallery Images</label>
            {galleryImgs.map((img, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGalleryImgChange(e, index)}
                  className="text-white"
                  disabled={isUpdating}
                />
                {galleryPreviews[index] && (
                  <Image
                    src={galleryPreviews[index] || "/placeholder.svg"}
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
                  disabled={isUpdating}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryInput}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              + Add another image
            </button>
            {errors.gallery && <p className="text-red-500 text-sm">{errors.gallery}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Gallery"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateGallery
