




import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { CategoryType } from "@/types/CategoryType";

// Create Category
export const createCategory = async (data: CategoryType) => {
  const docRef = await addDoc(collection(db, "categories"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// Get All Categories
export const getCategories = async (): Promise<CategoryType[]> => {
  const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as CategoryType),
  }));
};

// Get Single Category
export const getCategoryById = async (id: string): Promise<CategoryType | null> => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as CategoryType) };
};

// Update Category
export const updateCategory = async (category: CategoryType): Promise<void> => {
  if (!category.id) throw new Error("Category ID is required");

  const docRef = doc(db, "categories", category.id);
  await updateDoc(docRef, {
    ...category,
    updatedAt: serverTimestamp(),
  });
};

// Delete Category
export const deleteCategory = async (id: string) => {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
};
