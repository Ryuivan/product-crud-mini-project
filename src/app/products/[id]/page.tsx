import { notFound } from "next/navigation";
import { Product } from "../../interface/Product";
import { getProductById } from "../../services/getProductById";
import Link from "next/link";

interface ProductDetailProps {
  params: {
    id: string; 
  };
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const product: Product | null = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="text-black min-h-screen bg-gray-50 py-8 px-4">
      {product && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center md:flex-row md:items-start">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="md:ml-6 w-full md:w-1/2">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-xl text-gray-800 font-semibold mb-2">
                Price: Rp. {product.price}
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Stock: {product.stock}
              </p>
              <Link href={`/`}>
                <button className="mt-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
