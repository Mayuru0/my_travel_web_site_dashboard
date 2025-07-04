
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

import{galleryType} from '@/types/gallery'


//create Gallery

export const createGallery = async (data: galleryType) => {
  const docRef = await addDoc(collection(db, "gallery"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

//get Gallery

export const getGalleries = async () => {
  const snapshot = await getDocs(collection(db, "gallery"));
  const galleries = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      gallery: Array.isArray(data.galleryUrls) ? data.galleryUrls : [],
    };
  });
  return galleries;
};




  //delete Gallery
  export const deleteGallery = async (galleryId: string) => {
    await deleteDoc(doc(db, "gallery", galleryId));
  }


  //get single gallery
  export const getGalleryById = async (id: string): Promise<galleryType | null> => {
    const docRef = doc(db, "gallery", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as galleryType) };
  };


  //update Gallery
  export const updateGallery = async (gallery: galleryType): Promise<void> => {
    if (!gallery.id) throw new Error("Gallery id is required");
  
    const docRef = doc(db, "gallery", gallery.id);
    await updateDoc(docRef, {
      ...gallery,
      updatedAt: serverTimestamp(),
    });
  };