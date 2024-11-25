"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Product } from "./interface/Product";

export default function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data); 
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  useEffect(() => {
    console.log("Products:", products); 
  }, [products]);

  const handleDelete = async (id: string) => {
    console.log(`Deleting product with id: ${id}`);
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmation) {
      try {
        // Send the DELETE request with the product id as a query parameter
        const res = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          console.log(`Product with id: ${id} deleted successfully`); 
          fetchProducts();
        } else {
          console.error("Failed to delete product", res);
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }

    fetchProducts();
  };

  return (
    <div className="text-black max-w-7xl mx-auto flex items-center justify-between my-10 flex-col">
      <div className="w-full flex flex-row justify-between space-x-5">
        <h1 className="text-3xl font-bold mb-10">Product List</h1>

        <Link href="/products/create">
          <button className="bg-blue-500 px-4 py-2 rounded-md text-white mb-5 self-end">
            Add Product
          </button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-base text-gray-700 uppercase bg-orange-300">
            <tr className="text-center">
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {products.map((product: Product) => (
              <tr className="odd:bg-gray-100 even:bg-gray-300" key={product.id}>
                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap"
                >
                  {product.name}
                </th>

                <td className="px-6 py-4 text-center font-semibold">
                  Rp. {product.price}
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  {product.stock}
                </td>

                <td className="px-6 py-4 flex flex-row space-x-5">
                  <Link href={`/products/${product.id}`}>
                    <button className="bg-green-500 px-2 py-1 rounded-md text-white">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </Link>

                  <Link href={`/products/edit/${product.id}`}>
                    <button className="bg-blue-500 px-2 py-1 rounded-md text-white">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 px-2 py-1 rounded-md text-white"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
