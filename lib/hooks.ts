import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

const getAuthUserInfo = async () => {
  const authenticatedUser = await Auth.currentAuthenticatedUser();
  const token = authenticatedUser.signInUserSession.idToken.jwtToken;
  const userId = authenticatedUser.attributes.sub;
  const username = authenticatedUser.username;

  return { username, userId, token };
};

const getCommonRequestData = async () => {
  const { token } = await getAuthUserInfo();

  return {
    headers: {
      Authorization: token,
    },
  };
};

export const useGetProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      const requestData = await getCommonRequestData();

      const data = await API.get(
        "sallyapi",
        `/products/${productId}`,
        requestData
      );

      setProduct(data.Item);
      setIsLoading(false);
    };

    if (!product && productId) {
      getProduct();
    }
  }, [product, productId]);

  return { product, isLoading };
};

export const useGetProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const requestData = await getCommonRequestData();

      const data = await API.get("sallyapi", "/products", requestData);

      setProducts(data.Items);
      setIsLoading(false);
    };

    if (!products) {
      getProducts();
    }
  }, [products]);

  return { products, isLoading };
};
