import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { ShoppingCart } from "@/types/shoppingCart";
import { Order, OrderProduct } from "@/types/order";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

export const getAuthUserInfo = async () => {
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

export const usePaginatedGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lastEvaluatedId, setLastEvaluatedId] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchNextProducts = useCallback(async () => {
    const requestData = await getCommonRequestData();

    const data = await API.get("sallyapi", "/products", {
      ...requestData,
      queryStringParameters: {
        limit: 50,
        lastEvaluatedId,
      },
    });

    if (data.LastEvaluatedKey?.id) {
      setLastEvaluatedId(data.LastEvaluatedKey.id);
      setHasMore(true);
    } else {
      setLastEvaluatedId(undefined);
      setHasMore(false);
    }

    const newProductList = [...products, ...data.Items];
    setProducts(newProductList);
  }, [products, lastEvaluatedId]);

  // call fetchNextProducts on the initial render
  useEffect(() => {
    if (products.length === 0) {
      fetchNextProducts();
    }
  }, [products, fetchNextProducts]);

  return {
    products,
    lastEvaluatedId,
    hasMore,
    fetchProducts: fetchNextProducts,
  };
};

export const useShoppingCart = () => {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  // const [cartProducts, setCartProducts] = useState<Product[] | null>(null);
  const [isCartLoading, setIsLoading] = useState(true);
  const [isCartProductsLoading, setIsCartProductsLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

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

  // useEffect(() => {
  //   const getCartProducts = async () => {
  //     if (!cart) {
  //       return;
  //     }

  //     const partialRequestData = await getCommonRequestData();

  //     const requestData = {
  //       ...partialRequestData,
  //       queryStringParameters: {
  //         ids: cart.productIds,
  //       },
  //     };

  //     const data = await API.get("sallyapi", "/products", requestData);

  //     setCartProducts(data.Items);
  //     setIsCartProductsLoading(false);
  //   };

  //   if (cart && !cartProducts) {
  //     getCartProducts();
  //   }
  // }, [cart, cartProducts]);

  const addProductToCart = async (orderProduct: OrderProduct) => {
    let currentCart = cart;

    if (!currentCart) {
      // if cart does not exist - start a new one
      const { userId } = await getAuthUserInfo();

      currentCart = {
        userId,
        products: [],
      };
    }

    if (currentCart?.products.find((p) => p.id === orderProduct.id)) {
      // There is no need to add the product if it is already in the cart
      return;
    }

    const partialRequestData = await getCommonRequestData();

    const requestData = {
      ...partialRequestData,
      body: {
        ...currentCart,
        products: [
          ...(currentCart?.products ?? []),
          { ...orderProduct, quantity: orderProduct.quantity ?? 1 },
        ],
      },
    };

    const updatedCart = await API.post(
      "sallyapi",
      "/shoppingCart",
      requestData
    );

    setCart(updatedCart);
  };

  const removeProductFromCart = async (product: OrderProduct) => {
    if (!cart || !cart.products.find((p) => p.id === product.id)) {
      return;
    }

    const partialRequestData = await getCommonRequestData();

    const requestData = {
      ...partialRequestData,
      body: {
        ...cart,
        products: cart.products.filter((p) => p.id !== product.id),
      },
    };

    const updatedCart = await API.post(
      "sallyapi",
      "/shoppingCart",
      requestData
    );

    setCart(updatedCart);
  };

  const adjustProductQuantity = async (
    orderProduct: OrderProduct,
    quantity: number
  ) => {
    if (!cart || !cart.products.find((p) => p.id === orderProduct.id)) {
      return;
    }

    setIsUpdatingCart(true);

    const partialRequestData = await getCommonRequestData();

    const cartProducts = [...cart.products];
    const productToUpdate = cartProducts.find(
      (cp) => cp.id === orderProduct.id
    );

    if (!productToUpdate) {
      return;
    }

    productToUpdate.quantity = quantity;

    const requestData = {
      ...partialRequestData,
      body: {
        ...cart,
        products: cartProducts,
      },
    };

    const updatedCart = await API.post(
      "sallyapi",
      "/shoppingCart",
      requestData
    );

    setCart(updatedCart);
    setIsUpdatingCart(false);
  };

  return {
    cart,
    isCartLoading,
    // cartProducts,
    isCartProductsLoading,
    isUpdatingCart,
    addProductToCart,
    removeProductFromCart,
    adjustProductQuantity,
  };
};

export const useGetOrder = (orderId: string) => {
  const [order, setProduct] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      const requestData = await getCommonRequestData();

      const data = await API.get("sallyapi", `/orders/${orderId}`, requestData);

      setProduct(data.Item);
      setIsLoading(false);
    };

    if (!order && orderId) {
      getProduct();
    }
  }, [order, orderId]);

  return { order, isLoading };
};

export const useGetOrders = (userId?: string | undefined) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const requestData = await getCommonRequestData();

      const data = await API.get("sallyapi", "/orders", {
        ...requestData,
        queryStringParameters: userId ? userId : null,
      });

      setOrders(data.Items);
      setIsLoading(false);
    };

    if (!orders) {
      getProducts();
    }
  }, [orders, userId]);

  return { orders, isLoading };
};

export const useGetUserOrders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const { userId } = await getAuthUserInfo();
      const requestData = await getCommonRequestData();

      const data = await API.get("sallyapi", "/orders", {
        ...requestData,
        queryStringParameters: { userId },
      });

      setOrders(data.Items);
      setIsLoading(false);
    };

    if (!orders) {
      getProducts();
    }
  }, [orders]);

  return { orders, isLoading };
};
