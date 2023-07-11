"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetProduct, useShoppingCart } from "@/lib/hooks";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import { S3_BUCKET_URL } from "@/lib/utils";
import Button from "@mui/material/Button";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const { product, isLoading } = useGetProduct(params.productId);
  const { cart, addProductToCart, removeProductFromCart } = useShoppingCart();

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        product && (
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Image
                src={`${S3_BUCKET_URL}${product.imageKey}`}
                height={300}
                width={300}
                alt={`Image for ${product.name}`}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <h1 className="text-2xl text-gray-900 tracking-wide">
                {product.name}
              </h1>
              <p className="text-lg text-gray-800 tracking-wide">
                {currencyFormatter.format(product.price)}
              </p>
              <p className="text-gray-800 tracking-wide">
                {product.stockQuantity ? "In" : "Out of"} Stock
              </p>
              {/* TODO: allow adjusting quantity here - right now it assumes 1 */}
              {!cart?.products.find((p) => p.id === product.id) && (
                <Button
                  variant="outlined"
                  color="primary"
                  className="mt-2"
                  onClick={() => addProductToCart({ ...product, quantity: 1 })}
                  disabled={!product.stockQuantity}
                >
                  Add to Cart
                </Button>
              )}
              {cart?.products.find((p) => p.id === product.id) && (
                <Button
                  variant="outlined"
                  color="error"
                  className="mt-2"
                  onClick={() =>
                    removeProductFromCart({ ...product, quantity: 1 })
                  }
                >
                  Remove from Cart
                </Button>
              )}
            </Grid>
            <Grid xs={12}>
              <h1 className="text-gray-900 text-xl tracking-wide">
                Product Description
              </h1>
              <p className="text-gray-900 tracking-wide">
                {product.description}
              </p>
            </Grid>
          </Grid>
        )
      )}
    </div>
  );
};

export default ProductDetails;
