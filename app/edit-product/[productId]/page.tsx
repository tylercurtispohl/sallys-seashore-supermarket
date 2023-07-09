"use client";
import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../../../src/aws-exports";
import { useState, useEffect } from "react";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types/product";
import CircularProgress from "@mui/material/CircularProgress";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

// TODO: put this in an env var
const s3BucketUrl =
  "https://sallybucket102515-main.s3.us-west-1.amazonaws.com/public/";

const EditProduct = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      const requestData = {
        headers: {
          Authorization: token,
        },
      };

      const data = await API.get(
        "sallyapi",
        `/products/${params.productId}`,
        requestData
      );

      console.log(data);

      setProduct(data.Items);
      setIsLoading(false);
    };

    if (!product && params.productId) {
      getProduct();
    }
  }, [product, params.productId]);

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
