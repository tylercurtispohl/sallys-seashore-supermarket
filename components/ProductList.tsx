"use client";
import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import Image from "next/image";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

const s3BucketUrl =
  "https://sallybucket102515-main.s3.us-west-1.amazonaws.com/public/";

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      const requestData = {
        headers: {
          Authorization: token,
        },
      };

      const data = await API.get("sallyapi", "/products", requestData);

      setProducts(data.Items);
      setIsLoading(false);
    };

    if (!products) {
      getProducts();
    }
  }, [products]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        products &&
        products.map((p) => (
          <div key={p.id}>
            <Image
              src={`${s3BucketUrl}${p.imageKey}`}
              height={200}
              width={200}
              alt={`Product Image for ${p.name}`}
            />
            {p.name}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
