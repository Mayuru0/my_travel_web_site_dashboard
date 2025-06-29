"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// interface User {
//   name: string;
//   imageLink: string;
//   Role: string;
// }

const AdminuserTag: React.FC = () => {

  // const [user1, setUser] = useState<User | null>(null);
 
  const { user } = useAuth();
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         setUser({
  //           name: userData.name || "No Name",
  //           imageLink: userData.profileImageUrl || "/admin-avatar.png",
  //           Role: "(Admin)",
  //         });
  //       }
  //     }
  //   });

  //   return () => unsubscribe(); // cleanup
  // }, []);

  return (
        <div className="flex justify-center items-center h-full w-full relative">
      {user && (
        <div
          className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        >
          <Image
            className="rounded-full border-2 border-white object-cover"
            src={user.imageLink}
            alt="Profile"
            width={80}
            height={80}
          />
          <div>
            <h1 className="text-md font-bold text-white">{user.name}</h1>
            <h1 className="text-xs font-bold text-white">{user.Role}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminuserTag;
