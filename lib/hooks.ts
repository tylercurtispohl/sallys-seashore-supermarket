import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ShoppingCart } from "@/types/shoppingCart";

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
  const { token, userId } = await getAuthUserInfo();

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

export const useShoppingCart = () => {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[] | null>(null);
  const [isCartLoading, setIsLoading] = useState(true);
  const [isCartProductsLoading, setIsCartProductsLoading] = useState(true);

  useEffect(() => {
    const getCart = async () => {
      const { userId } = await getAuthUserInfo();
      const partialRequestData = await getCommonRequestData();

      const requestData = {
        ...partialRequestData,
        queryStringParameters: {
          userId,
        },
      };

      const data = await API.get("sallyapi", "/shoppingCart", requestData);

      setCart(data.Items[0]);
      setIsLoading(false);
    };

    if (!cart) {
      getCart();
    }
  }, [cart]);

  useEffect(() => {
    const getCartProducts = async () => {
      if (!cart) {
        return;
      }

      const partialRequestData = await getCommonRequestData();

      const requestData = {
        ...partialRequestData,
        queryStringParameters: {
          ids: cart.productIds,
        },
      };

      const data = await API.get("sallyapi", "/products", requestData);

      setCartProducts(data.Items);
      setIsCartProductsLoading(false);
    };

    if (cart && !cartProducts) {
      getCartProducts();
    }
  }, [cart, cartProducts]);

  const addProductToCart = async (productId: string) => {
    let currentCart = cart;

    if (!currentCart) {
      // if cart does not exist - start a new one
      const { userId } = await getAuthUserInfo();

      currentCart = {
        userId,
        productIds: [],
      };
    }

    if (currentCart?.productIds.includes(productId)) {
      // There is no need to add the product if it is already in the cart
      return;
    }

    const partialRequestData = await getCommonRequestData();

    const requestData = {
      ...partialRequestData,
      body: {
        ...currentCart,
        productIds: [...(currentCart?.productIds ?? []), productId],
      },
    };

    const updatedCart = await API.post(
      "sallyapi",
      "/shoppingCart",
      requestData
    );

    setCart(updatedCart);
  };

  const removeProductFromCart = async (productId: string) => {
    if (!cart || !cart.productIds.includes(productId)) {
      return;
    }

    const partialRequestData = await getCommonRequestData();

    const requestData = {
      ...partialRequestData,
      body: {
        ...cart,
        productIds: cart.productIds.filter((id) => id !== productId),
      },
    };

    const updatedCart = await API.post(
      "sallyapi",
      "/shoppingCart",
      requestData
    );

    setCart(updatedCart);
  };

  return {
    cart,
    isCartLoading,
    cartProducts,
    isCartProductsLoading,
    addProductToCart,
    removeProductFromCart,
  };
};
