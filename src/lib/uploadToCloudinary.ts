export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "travelweb")

  const res = await fetch("https://api.cloudinary.com/v1_1/dy972wrlb/image/upload", {
    method: "POST",
    body: formData,
  })

 const data = await res.json()
  if (!res.ok || !data.secure_url) {
    throw new Error("Image upload failed")
  }

  return data.secure_url
}