import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../db/firebase"; 
import { NextResponse } from "next/server"; 

// GET method to fetch products
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(products);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE method to delete a product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error deleting product:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// POST method to create a product
export async function POST(req: Request) {
  try {
    const data = await req.json();

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

    const productRef = await addDoc(collection(db, "products"), {
      name: data.name,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image: data.image,
    });

    return NextResponse.json(
      { message: "Product created successfully", productId: productRef.id },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Error creating product:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
