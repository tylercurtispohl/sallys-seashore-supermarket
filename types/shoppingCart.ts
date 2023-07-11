import { OrderProduct } from "./order";

export type ShoppingCart = {
  id?: string | undefined;
  products: OrderProduct[];
  userId: string;
};
