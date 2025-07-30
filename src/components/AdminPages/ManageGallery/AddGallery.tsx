"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MdKeyboardArrowLeft } from "react-icons/md"
import Image from "next/image"
import toast from "react-hot-toast"
import { createGallery } from "@/lib/gallery"
import { uploadGalleryImageToCloudinary } from "@/lib/uploadToCloudinary"
import type { galleryType } from "@/types/gallery"
import type { CategoryType } from "@/types/CategoryType"
import { getCategories } from "@/lib/category"

const AddGallery = () => {
  const router = useRouter()

  // Store categories fetched from backend
  const [categories, setCategories] = useState<CategoryType[]>([])

  // Store text fields normally
  const [formData, setFormData] = useState({
    categoryId: "", // store selected category id
    date: "",
    province: "",
    description: "",
    subtitle: "",
  })

  // For images, store File or preview URLs
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null)
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null)

  // For gallery images: store array of Files and previews
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Progress tracking
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  // Fetch categories once on mount
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

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle cover image file select and preview
  const handleCoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setCoverImgFile(file)
    if (file) {
      setCoverImgPreview(URL.createObjectURL(file))
    } else {
      setCoverImgPreview(null)
    }
  }

  // Handle adding new gallery image input file
  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      // Update galleryFiles at index or add new
      setGalleryFiles((prev) => {
        const copy = [...prev]
        copy[index] = file
        return copy
      })
    }
  }

  // Add empty gallery image slot
  const addGalleryInput = () => {
    setGalleryFiles((prev) => [...prev, undefined as unknown as File]) // add empty placeholder
  }

  // Remove gallery image slot and preview at index
  const removeGalleryInput = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Generate previews for gallery files on files change
  useEffect(() => {
    const newPreviews = galleryFiles.map((file) => (file ? URL.createObjectURL(file) : ""))
    setGalleryPreviews(newPreviews)
    // Cleanup object URLs on unmount or change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [galleryFiles])

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.categoryId) newErrors.categoryId = "Category selection is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.province) newErrors.province = "Province is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!coverImgFile) newErrors.coverImg = "Cover image is required"
    if (galleryFiles.length === 0 || galleryFiles.some((file) => !file)) {
      newErrors.gallery = "All gallery images are required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Progress Bar Component
  const ProgressBar = () => {
    if (!isSubmitting) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#0F172B] border border-zinc-700 rounded-lg p-6 w-96">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Uploading Gallery...</h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>{currentStep}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">Please wait while we upload your images...</div>
        </div>
      </div>
    )
  }

  // On submit with progress tracking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Step 1: Upload cover image (0-30%)
      setCurrentStep("Uploading cover image...")
      setUploadProgress(10)

      const coverImgUrl = await uploadGalleryImageToCloudinary(coverImgFile as File)
      setUploadProgress(30)

      // Step 2: Upload gallery images (30-80%)
      setCurrentStep("Uploading gallery images...")
      const totalGalleryImages = galleryFiles.length
      const galleryUrls: string[] = []

      for (let i = 0; i < galleryFiles.length; i++) {
        const url = await uploadGalleryImageToCloudinary(galleryFiles[i])
        galleryUrls.push(url)

        // Update progress for each gallery image
        const progressPerImage = 50 / totalGalleryImages // 50% total for gallery images
        const currentProgress = 30 + progressPerImage * (i + 1)
        setUploadProgress(Math.round(currentProgress))
      }

      // Step 3: Save to database (80-100%)
      setCurrentStep("Saving to database...")
      setUploadProgress(85)

      // Find selected category title from categories list
      const selectedCategory = categories.find((cat) => cat.id === formData.categoryId)

      const newGalleryItem = {
        title: selectedCategory?.title || "",
        subtitle: formData.subtitle || "",
        date: formData.date,
        province: formData.province,
        description: formData.description,
        coverImgUrl,
        galleryUrls,
      }

      // Save to Firestore
      await createGallery(newGalleryItem as galleryType)

      setUploadProgress(100)
      setCurrentStep("Complete!")

      // Small delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success("Gallery item added successfully!")

      // Reset form
      setFormData({
        categoryId: "",
        subtitle: "",
        date: "",
        province: "",
        description: "",
      })
      setCoverImgFile(null)
      setCoverImgPreview(null)
      setGalleryFiles([])
      setGalleryPreviews([])
      setErrors({})
    } catch (error) {
      console.error("Upload failed:", error)
      toast.error("Failed to add gallery item")
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
      setCurrentStep("")
    }
  }

  return (
    <div className="p-6 min-h-screen text-white">
      {/* Progress Bar Overlay */}
      <ProgressBar />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-white text-sm mb-4 hover:underline cursor-pointer"
        disabled={isSubmitting}
      >
        <MdKeyboardArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl mx-auto p-6 rounded-lg border border-zinc-700">
        <h2 className="text-2xl font-bold mb-6">🖼 Add New Gallery Item</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selection */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              disabled={isSubmitting}
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

          {/* Subtitle */}
          <div>
            <label className="block mb-1 font-medium">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border border-zinc-700 px-3 py-2 rounded bg-[#0F172B] text-white"
              placeholder="Enter subtitle"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImgChange}
              className="text-white"
              disabled={isSubmitting}
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
            {errors.coverImg && <p className="text-red-500 text-sm mt-1">{errors.coverImg}</p>}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryInput}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              + Add another image
            </button>
            {errors.gallery && <p className="text-red-500 text-sm mt-1">{errors.gallery}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Add Gallery"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddGallery
