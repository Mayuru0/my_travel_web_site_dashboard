"use client";

import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

interface User {
  id: string; // from Firestore doc id
  name: string;
  nic: string;
  contactNumber: string;
  email: string;
  profileImageUrl: string;
}

const UsersTable = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // <-- loading state
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUserData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(userData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = userData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUserData((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    alert(`Edit user with ID: ${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen text-white flex justify-center items-center">
        <p>Loading users...</p>
      </div>
    );
  }

  if (!isLoading && userData.length === 0) {
    return (
      <div className="p-6 min-h-screen text-white flex justify-center items-center">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-zinc-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Profile Picture</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">NIC</th>
              <th className="px-4 py-3">Contact Number</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {currentItems.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800 transition">
                <td className="px-4 py-3">
                  <Image
                    src={user.profileImageUrl || "/default-avatar.png"}
                    width={48}
                    height={48}
                    alt={user.name}
                    className="rounded-full object-cover w-12 h-12 border border-gray-500"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-white">{user.name}</td>
                <td className="px-4 py-3">{user.nic}</td>
                <td className="px-4 py-3">{user.contactNumber}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="text-blue-400 hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
    </div>
  );
};

export default UsersTable;
