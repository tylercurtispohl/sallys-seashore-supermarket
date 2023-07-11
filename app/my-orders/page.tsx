"use client";
import { useGetUserOrders } from "@/lib/hooks";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { orderBy } from "lodash";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "next/link";
import Image from "next/image";
import { S3_BUCKET_URL } from "@/lib/utils";
import { DateTime } from "luxon";

const MyOrders = () => {
  const { orders, isLoading } = useGetUserOrders();

  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h1 className="tracking-wide text-gray-900 text-xl my-5">
            Your Orders
          </h1>
          {orders &&
            orderBy(orders, ["createdAt"], ["desc"]).map((order) => (
              <Link key={order.id} href={`/order-details/${order.id}`}>
                <div className="border-b-2 border-gray-200 mb-4 pb-4">
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <div className="text-gray-900 tracking-wide">
                        <p>{order.id}</p>
                        <p>
                          Created:{" "}
                          {DateTime.fromISO(order.createdAt).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                        </p>
                        <p>Status: {order.status}</p>
                        {order.shippingCompany && (
                          <p>Shipping Company: {order.shippingCompany}</p>
                        )}
                        {order.trackingNumber && (
                          <p>Tracking Number: {order.trackingNumber}</p>
                        )}
                      </div>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <p>Items:</p>
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-row gap-2 mb-2"
                        >
                          <Image
                            src={`${S3_BUCKET_URL}${product.imageKey}`}
                            height={50}
                            width={50}
                            alt={`Image for ${product.name}`}
                          />
                          <p>{product.name}</p>
                          <p>x{product.quantity}</p>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </div>
              </Link>
            ))}
        </>
      )}
    </>
  );
};

export default MyOrders;
