"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0); 
  const [stock, setStock] = useState(0); 
  const [description, setDescription] = useState(""); 
  const [image, setImageLink] = useState(""); 
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!name || !price || !stock || !description || !image) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          stock,
          description,
          image,
        }),
      });

      if (res.ok) {
        console.log("product: " + res.json());
        router.push("/")
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create product.");
      }
    } catch (error) {
      setError("Error creating product.");
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg text-black">
      <h2 className="text-2xl font-bold mb-5">Create New Product</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            id="price"
            type="number"
            value={price || 0} // Set to a number
            onChange={(e) => setPrice(Number(e.target.value))} // Convert to number
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={stock || 0} // Set to a number
            onChange={(e) => setStock(Number(e.target.value))} // Convert to number
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageLink" className="block text-sm font-medium text-gray-700">
            Image Link
          </label>
          <input
            id="imageLink"
            type="text"
            value={image || ""}
            onChange={(e) => setImageLink(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
