import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../db/firebase"; // Sesuaikan path jika diperlukan
import { NextResponse } from "next/server"; // Impor NextResponse

// GET method to fetch products
export async function GET() {
  try {
    // Mengambil data produk dari Firestore
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Mengembalikan data sebagai response JSON menggunakan NextResponse
    return NextResponse.json(products);
  } catch (err: any) {
    // Menangani error dan mengirimkan response error
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE method to delete a product
export async function DELETE(req: Request) {
  try {
    // Extracting the product ID from the URL (assuming it's passed as a query parameter or URL param)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get reference to the product document
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef); // Delete the product from Firestore

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    // Handle errors and send a response with the error message
    console.error("Error deleting product:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate input
    if (
      !data.name ||
      !data.price ||
      !data.stock ||
      !data.description ||
      !data.image
    ) {
      return NextResponse.json(
        { message: "Please provide all product details." },
        { status: 400 }
      );
    }

    // Add the new product to Firestore
    const productRef = await addDoc(collection(db, "products"), {
      name: data.name,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image: data.image,
    });

    // Respond with the new product ID
    return NextResponse.json(
      { message: "Product created successfully", productId: productRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
