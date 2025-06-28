"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Room {
  roomNo: string
  category: string
  maxGuests: number
  specialDeal: string
  status: string
}

const Users: React.FC = () => {
  const rooms: Room[] = [
    {
      roomNo: "101",
      category: "Boutique",
      maxGuests: 2,
      specialDeal: "Charming boutique room with unique decor",
      status: "Stylish and comfortable",
    },
    {
      roomNo: "102",
      category: "Standard",
      maxGuests: 2,
      specialDeal: "Comfortable room with modern amenities",
      status: "Clean and well-maintained",
    },
    {
      roomNo: "103",
      category: "Villa",
      maxGuests: 4,
      specialDeal: "Luxury villa with a pool",
      status: "Perfect for group getaways",
    },
    {
      roomNo: "104",
      category: "Cabin",
      maxGuests: 3,
      specialDeal: "Rustic cabin in the woods",
      status: "Escape to nature",
    },
    {
      roomNo: "105",
      category: "Deluxe Suite",
      maxGuests: 2,
      specialDeal: "Luxury suite with a personal butler",
      status: "Pamper yourself",
    },
    {
      roomNo: "106",
      category: "Garden Room",
      maxGuests: 2,
      specialDeal: "Room overlooking the garden",
      status: "Relaxing atmosphere",
    },
    {
      roomNo: "107",
      category: "Ocean View",
      maxGuests: 2,
      specialDeal: "Room with an ocean view",
      status: "Enjoy the sea breeze",
    },
    {
      roomNo: "108",
      category: "Sky Room",
      maxGuests: 3,
      specialDeal: "Room with stunning skyline views",
      status: "Enjoy the city lights",
    },
    {
      roomNo: "109",
      category: "Forest Lodge",
      maxGuests: 4,
      specialDeal: "Lodge surrounded by trees",
      status: "Reconnect with nature",
    },
    {
      roomNo: "110",
      category: "City Center",
      maxGuests: 2,
      specialDeal: "Room in the heart of the city",
      status: "Convenient location",
    },
    {
      roomNo: "111",
      category: "Barn Room",
      maxGuests: 2,
      specialDeal: "Rustic style room with vintage decor",
      status: "Nostalgic experience",
    },
    {
      roomNo: "112",
      category: "Modern Loft",
      maxGuests: 3,
      specialDeal: "Stylish loft with high ceilings",
      status: "Contemporary design",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors = [
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50">
            <TableHead className="font-semibold text-purple-800">Room No</TableHead>
            <TableHead className="font-semibold text-purple-800">Category</TableHead>
            <TableHead className="font-semibold text-purple-800">Max Guests</TableHead>
            <TableHead className="font-semibold text-purple-800">Special Deal</TableHead>
            <TableHead className="font-semibold text-purple-800">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room, index) => (
            <TableRow key={index} className="hover:bg-purple-50/50 transition-colors">
              <TableCell className="font-medium text-purple-800">{room.roomNo}</TableCell>
              <TableCell className="text-gray-700">{room.category}</TableCell>
              <TableCell className="text-gray-700">{room.maxGuests}</TableCell>
              <TableCell className="text-gray-600 max-w-xs truncate">{room.specialDeal}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Users
