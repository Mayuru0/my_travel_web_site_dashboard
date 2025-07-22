"use client";
import React from 'react'
//import AdminuserTag from '@/components/adminCommon/AdminuserTag';
import { format } from "date-fns"
import Image from 'next/image';
import Link from 'next/link';
import Alogo1 from '../../../public/logo/1.png';
import { useClock } from "@/context/ClockContext";
const AdminHeader = () => {
//   const [currentDate, setCurrentDate] = useState<Date | null>(null);

// useEffect(() => {
//   const interval = setInterval(() => {
//     setCurrentDate(new Date());
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);
const currentDate = useClock();
  return (
    <header className="h-20 w-full rounded-l-full ml-[1%] bg-gray-800 flex items-center justify-between px-6 shadow-md">
      {/* Logo or Title */}
      <div className='flex pt-4 items-center gap-3'>
        <Link href="/dashboard">
          <Image
            src={Alogo1}
            alt="Logo"
            width={100}
            height={100}
            className="w-15 h-auto rounded-full ml-2 mb-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
          />
        </Link>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>

      {/* Date and Time */}
      <div className="text-right">
        {currentDate && (
          <>
            <p className="text-purple-100 text-xl">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-white text-2xl">
              {format(currentDate, "hh:mm:ss a")}
            </p>
          </>
        )}
      </div>

      {/* Future: User Info or Logout */}
      {/* <div className="flex items-center gap-4">
        <AdminuserTag/>
      </div> */}
    </header>
  );
};

export default AdminHeader;
