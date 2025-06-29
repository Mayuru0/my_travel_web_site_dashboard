import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { Vlog } from "@/types/vlog";


export const createVlog = async (data: Vlog) => {
  const docRef = await addDoc(collection(db, "vlogs"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};


export const getVlogs = async (): Promise<Vlog[]> => {
  const q = query(collection(db, "vlogs"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const vlogs: Vlog[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vlog[];

  return vlogs;
};


export const deleteVlog = async (vlogId: string) => {
  await deleteDoc(doc(db, "vlogs", vlogId));
};


// Get single vlog by ID
export const getVlogById = async (id: string): Promise<Vlog | null> => {
  const docRef = doc(db, "vlogs", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as Vlog) };
};

// Update vlog data
export const updateVlog = async (vlog: Vlog): Promise<void> => {
  if (!vlog.id) throw new Error("Vlog id is required");

  const docRef = doc(db, "vlogs", vlog.id);
  await updateDoc(docRef, {
    ...vlog,
    updatedAt: serverTimestamp(),
  });
};