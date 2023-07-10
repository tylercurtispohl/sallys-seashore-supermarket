"use client";
import ProductForm from "@/components/ProductForm";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetProduct } from "@/lib/hooks";

const EditProduct = ({ params }: { params: { productId: string } }) => {
  const { product, isLoading } = useGetProduct(params.productId);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        product && <ProductForm mode="edit" product={product} />
      )}
    </div>
  );
};

export default EditProduct;
