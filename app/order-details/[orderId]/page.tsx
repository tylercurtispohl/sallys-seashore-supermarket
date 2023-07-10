"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetOrder } from "@/lib/hooks";
import OrderProductsList from "@/components/OrderProductsList";

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const { order, isLoading } = useGetOrder(params.orderId);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        order && (
          <>
            <h1 className="text-xl tracking-wide text-gray-900 mb-5">
              Order {order.id}
            </h1>
            <p className="text-lg tracking-wide text-gray-900">
              Created: {order.createdAt}
            </p>
            <p className="text-lg tracking-wide text-gray-900">
              Status: {order.status}
            </p>
            {order.trackingNumber && (
              <p className="text-lg tracking-wide text-gray-900">
                Tracking Number: {order.trackingNumber}
              </p>
            )}
            <p className="text-lg tracking-wide text-gray-900">Shipping to:</p>
            <p className="text-lg tracking-wide text-gray-900">{order.name}</p>
            <p className="text-lg tracking-wide text-gray-900">
              {order.addressLine1}
            </p>
            {order.addressLine2 && (
              <p className="text-lg tracking-wide text-gray-900">
                {order.addressLine1}
              </p>
            )}
            <p className="text-lg tracking-wide text-gray-900 mb-5">
              {order.city}, {order.state} {order.postalCode}
            </p>
            <OrderProductsList products={order.products} />
          </>
        )
      )}
    </>
  );
};

export default OrderDetails;
