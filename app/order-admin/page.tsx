"use client";
import { useGetOrders } from "@/lib/hooks";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { orderBy } from "lodash";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "next/link";

const OrderAdmin = () => {
  const { orders, isLoading } = useGetOrders();

  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className="tracking-wide text-gray-900 text-xl my-5">
            All Orders
          </h1>
          {orders &&
            orderBy(orders, ["createdAt"], ["desc"]).map((order) => (
              <div
                key={order.id}
                className="border-b-2 border-gray-200 mb-2 pb-2"
              >
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <Link href={`/edit-order/${order.id}`}>
                      <div className="text-gray-900 tracking-wide">
                        <p>{order.id}</p>
                        <p>Created: {order.createdAt}</p>
                        <p>Status: {order.status}</p>
                        {order.trackingNumber && (
                          <p>Tracking Number: {order.trackingNumber}</p>
                        )}
                      </div>
                    </Link>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Link href={`/edit-order/${order.id}`}>
                      <p>Items:</p>
                      {order.products.map((product) => (
                        <p key={product.id}>{product.name}</p>
                      ))}
                    </Link>
                  </Grid>
                </Grid>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default OrderAdmin;
