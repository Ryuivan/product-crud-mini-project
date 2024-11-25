import { db } from "../db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "../interface/Product";

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  } else {
    return null;
  }
};
