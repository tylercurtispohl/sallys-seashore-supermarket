"use client";
import React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import ProductList from "@/components/ProductList";

const ProductAdmin = () => {
  return (
    <div>
      <Link href="/create-product">
        <Button variant="outlined">Add New Product</Button>
      </Link>
      <ProductList></ProductList>
    </div>
  );
};

export default ProductAdmin;
