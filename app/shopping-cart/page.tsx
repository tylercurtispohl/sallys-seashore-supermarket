"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { useShoppingCart } from "@/lib/hooks";
import Image from "next/image";
import { S3_BUCKET_URL } from "@/lib/utils";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ShoppingCart = () => {
  const {
    cart,
    cartProducts,
    isLoading,
    isCartProductsLoading,
    addProductToCart,
    removeProductFromCart,
  } = useShoppingCart();

  return (
    <>
      {isLoading || isCartProductsLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        <div className=" border-b-2 border-b-gray-200">
          {cartProducts &&
            cartProducts.map((product) => (
              <div key={product.id} className="mb-2 pb-2 flex flex-row gap-5">
                <Image
                  src={`${S3_BUCKET_URL}${product.imageKey}`}
                  height={100}
                  width={100}
                  alt={`Image for ${product.name}`}
                />
                <div className="flex flex-col justify-around">
                  <h3 className="text-lg tracking-wide">{product.name}</h3>
                </div>

                <div className="flex flex-col justify-around flex-grow text-right">
                  <h3 className="text-lg tracking-wide">
                    {currencyFormatter.format(product.price)}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
