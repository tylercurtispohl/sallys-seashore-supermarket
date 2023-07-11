import { Product } from "./product";

export type OrderProduct = Product & { quantity: number };

export type Order = {
  addressLine1: string;
  addressLine2?: string | null | undefined;
  city: string;
  createdAt: string;
  id?: string | null | undefined;
  name: string;
  postalCode: string;
  products: OrderProduct[];
  shippingCompany?: string | null | undefined;
  shippingMethod?: string | null | undefined;
  state: string;
  status: "processing" | "shipped" | "cancelled" | "delivered";
  trackingNumber?: string | null | undefined;
};
