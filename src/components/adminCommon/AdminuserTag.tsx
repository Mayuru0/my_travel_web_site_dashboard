'use client';

import React, { useEffect, useRef, useState } from 'react';

interface User {
  name: string;
  imageLink: string;
}

const AdminuserTag: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate fetching user data (replace this with actual logic)
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = {
        name: 'Admin',
        imageLink: '/admin-avatar.png',
      };
      setUser(storedUser);
    };

    fetchUser();
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="flex justify-center items-center h-full w-full relative"
    >
      {user && (
        <div
          className="flex flex-col justify-center items-center gap-2 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            className="rounded-full border-2 border-white"
            src={user.imageLink}
            alt="Profile"
            width={50}
            height={50}
          />
          <h1 className="text-lg font-bold text-white">{user.name}</h1>
        </div>
      )}
    </div>
  );
};

export default AdminuserTag;
