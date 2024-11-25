"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../../../interface/Product";
import { getProductById } from "../../../services/getProductById";
import { updateProduct } from "../../../services/updateProduct";

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      setResolvedParams(unwrappedParams);
    };

    fetchParams();
  }, [params]);

  const id = resolvedParams?.id;
  console.log("id: " + id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(id);

        if (!fetchedProduct) {
          setError("Product not found");
          return;
        }
        setProduct(fetchedProduct);
        console.log(product);

        setFormData({
          id: fetchedProduct.id,
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          price: fetchedProduct.price,
          stock: fetchedProduct.stock,
          image: fetchedProduct.image,
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("Product ID is missing");
      return;
    }

    try {
      const updatedProduct = await updateProduct(id, formData);
      console.log(updatedProduct);
      router.push(`/`);
    } catch {
      setError("Failed to update product");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg my-10 text-black">
      <h1 className="text-2xl font-semibold text-center mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="price"
          >
            Price (Rp)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="stock"
          >
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="image"
          >
            Product Image URL
          </label>
          <input
            id="image"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
