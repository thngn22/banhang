import { jacket } from "../../../Data/jacket";
import { tShirt } from "../../../Data/t-shirt";
import ProductCard from "../../components/Product/ProductCard";
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import * as ProductService from "../../../services/ProductService";

const products = [...jacket, ...tShirt];

export default function ProductPage() {
  const { categoryId } = useParams()

  const { data: products } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => {
      return ProductService.getAllProductByCategory({ id: categoryId })
    }
  })

  const categoryName = products?.[0]?.categoryName
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {categoryName}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product, index) => (
            <div key={index} className="group relative">
              {/* <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.imageUrl}
                  alt={product.imageUrl}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price}
                </p>
              </div> */}
              <ProductCard data={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
