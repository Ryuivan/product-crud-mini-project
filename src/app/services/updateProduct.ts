import { db } from "../db/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Product } from "../interface/Product";

export const updateProduct = async (
  id: string,
  productData: Product
): Promise<Product | null> => {
  const docRef = doc(db, "products", id);

  const updatedData = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    image: productData.image,
  };

  try {
    await updateDoc(docRef, updatedData);
    return { ...updatedData, id };
  } catch (error) {
    throw new Error("Error updating product");
  }
};
