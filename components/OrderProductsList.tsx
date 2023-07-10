"use client";
import { S3_BUCKET_URL } from "@/lib/utils";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { sum } from "lodash";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const OrderProductsList = ({ products }: { products: Product[] }) => {
  return (
    <>
      <div className=" border-b-2 border-b-gray-200 text-gray-900">
        {products.map((product) => (
          <div key={product.id} className="mb-2 pb-2 flex flex-row">
            <Link
              href={`/product-details/${product.id}`}
              className="flex flex-row gap-5"
            >
              <Image
                src={`${S3_BUCKET_URL}${product.imageKey}`}
                height={100}
                width={100}
                alt={`Image for ${product.name}`}
              />
              <div className="flex flex-col justify-around">
                <h3 className="text-lg tracking-wide">{product.name}</h3>
              </div>
            </Link>

            <div className="flex flex-col justify-around flex-grow text-right">
              <h3 className="text-lg tracking-wide">
                {currencyFormatter.format(product.price)}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-end text-lg tracking-wide text-gray-900 gap-2 mt-2">
        <p>Total: </p>
        <p>{currencyFormatter.format(sum(products.map((p) => p.price)))}</p>
      </div>
    </>
  );
};

export default OrderProductsList;
