"use client";
import React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import ProductList from "@/components/ProductList";

const ProductAdmin = () => {
  return (
    <div>
      <div className="flex flex-row justify-between mb-5">
        <h1 className="text-gray-900 text-xl tracking-wider">Product Admin</h1>
        <Link href="/create-product">
          <Button variant="outlined">Add New Product</Button>
        </Link>
      </div>
      <ProductList actionLink="/edit-product" showStockQuantity></ProductList>
    </div>
  );
};

export default ProductAdmin;
