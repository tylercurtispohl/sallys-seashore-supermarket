"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuthUserInfo, useGetOrder } from "@/lib/hooks";
import OrderProductsList from "@/components/OrderProductsList";
import EditOrderForm from "@/components/EditOrderForm";

const EditOrder = ({ params }: { params: { orderId: string } }) => {
  const { order, isLoading } = useGetOrder(params.orderId);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        <>
          {order && (
            <>
              <EditOrderForm order={order} />
              <OrderProductsList products={order?.products} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default EditOrder;
