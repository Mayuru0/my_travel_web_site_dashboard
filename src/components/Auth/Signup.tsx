/* eslint-disable */
"use client"
import { useEffect, useState } from "react"
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MdKeyboardArrowLeft } from "react-icons/md"
import profilePic from "./../../../public/profile/profiePic.png"
import { CiCamera } from "react-icons/ci"
import { Loader2 } from "lucide-react";
export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
 const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500); // 1.5s splash
    return () => clearTimeout(timer);
  }, []);

 const [formData, setFormData] = useState({
  role: "",
  name: "",
  nic: "",
  contactNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
})


  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

 const inputFields = [
  { name: "name", type: "text", placeholder: "Name" },
  { name: "nic", type: "text", placeholder: "NIC" },
  { name: "contactNumber", type: "text", placeholder: "Contact No" },
  { name: "email", type: "email", placeholder: "Email" },
  { name: "password", type: "password", placeholder: "Password" },
  { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
]


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  if (!formData.name) newErrors.name = "Name is required"
  if (!formData.nic) newErrors.nic = "NIC is required"
  if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required"
  if (!formData.email) newErrors.email = "Email is required"
  if (!formData.password) newErrors.password = "Password is required"
  if (formData.password && formData.password.length < 6)
    newErrors.password = "Password must be at least 6 characters"
  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm password is required"
  if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match"
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is not valid"
  }
  if (!profileImage) {
    newErrors.profileImage = "Profile image is required"
  } else if (!/^image\//.test(profileImage.type)) {
    newErrors.profileImage = "Please upload a valid image file"
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
      router.push('/');
  }



 if (initialLoading ) {
    return (
      <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      <Image
        src="/banner/2.JPG"
        alt="Login Background"
        fill
        className="w-full h-full object-cover absolute inset-0 z-0 scale-105 blur-[1px] transition duration-700"
      />
        <div className="flex justify-center items-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }


  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      <Image
        src="/banner/2.JPG"
        alt="Login Background"
        fill
        className="w-full h-full object-cover absolute inset-0 z-0 scale-105 blur-[1px] transition duration-700"
      />

  
   <div className="rounded-xl bg-white/10 backdrop-blur-xl border border-zinc-700 p-4  mt-4 shadow-2xl shadow-violet-700/10 transition-all duration-300 hover:shadow-violet-500/20">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    
    {/* Left Side: Image */}
    <div className="hidden md:flex items-center justify-center">
      <Image
        src="/banner/image.webp" 
        alt="Decorative"
        width={500}
        height={500}
        className="object-contain rounded-lg"
      />
    </div>

    {/* Right Side: Form */}
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-raleway">Create Your Account</h1>
      </div>

      {/* Profile image uploader */}
      <div className="flex justify-center mb-8 relative">
        <label
          htmlFor="profileImage"
          className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-violet-500 transition-all duration-300"
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Profile Preview"
              width={96}
              height={96}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image src={profilePic} alt="Profile picture" fill className="object-cover" />
              <CiCamera className="absolute inset-0 m-auto text-white text-4xl" />
            </div>
          )}
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        {errors.profileImage && (
          <p className="absolute mt-24 text-red-500 text-xs sm:text-sm">{errors.profileImage}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-200"
                required
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 rounded-lg hover:bg-green-600 text-white py-2 px-4 transition-colors duration-200 mt-2 text-sm sm:text-base flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            "Register"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center text-xs sm:text-sm mt-4 ">
          <span className="text-gray-200">Already have an account? </span>
          <Link href="/" className="text-green-400 hover:underline">Sign in</Link>
        </div>
      </form>
    </div>
  </div>
</div>

    </div>
  )
}
