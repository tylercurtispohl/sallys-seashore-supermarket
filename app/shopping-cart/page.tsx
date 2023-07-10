"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { useShoppingCart } from "@/lib/hooks";
import Image from "next/image";
import { S3_BUCKET_URL } from "@/lib/utils";
import { sum } from "lodash";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().notRequired(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup.string().required("Postal Code is required"),
});

const ShoppingCart = () => {
  const {
    cart,
    cartProducts,
    isCartLoading,
    isCartProductsLoading,
    removeProductFromCart,
  } = useShoppingCart();

  const formik = useFormik({
    initialValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      {isCartLoading || isCartProductsLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        <div className=" border-b-2 border-b-gray-200 text-gray-900">
          {cartProducts &&
            cartProducts.map((product) => (
              <div key={product.id} className="mb-2 pb-2 flex flex-row">
                <Link
                  href={`/product-details/${product.id}`}
                  className="flex flex-row gap-5"
                >
                  <Image
                    src={`${S3_BUCKET_URL}${product.imageKey}`}
                    height={100}
                    width={100}
                    alt={`Image for ${product.name}`}
                  />
                  <div className="flex flex-col justify-around">
                    <h3 className="text-lg tracking-wide">{product.name}</h3>
                  </div>
                </Link>

                <div className="flex flex-col justify-around flex-grow text-right">
                  <h3 className="text-lg tracking-wide">
                    {currencyFormatter.format(product.price)}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="flex flex-row justify-end text-lg tracking-wide text-gray-900 gap-2 mt-2">
        <p>Total: </p>
        <p>
          {currencyFormatter.format(sum(cartProducts?.map((p) => p.price)))}
        </p>
      </div>
      <h1 className="text-xl tracking-wider mt-5">Place Order:</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              id="name_input"
              name="name"
              label="Name"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            ></TextField>
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              id="addressLine1_input"
              name="addressLine1"
              label="Address Line 1"
              variant="standard"
              value={formik.values.addressLine1}
              onChange={formik.handleChange}
              error={
                formik.touched.addressLine1 &&
                Boolean(formik.errors.addressLine1)
              }
              helperText={
                formik.touched.addressLine1 && formik.errors.addressLine1
              }
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="addressLine2_input"
              name="addressLine2"
              label="Address Line 2"
              variant="standard"
              value={formik.values.addressLine2}
              onChange={formik.handleChange}
              error={
                formik.touched.addressLine2 &&
                Boolean(formik.errors.addressLine2)
              }
              helperText={
                formik.touched.addressLine2 && formik.errors.addressLine2
              }
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="city_input"
              name="city"
              label="City"
              variant="standard"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="state_input"
              name="state"
              label="State"
              variant="standard"
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="postalCode_input"
              name="postalCode"
              label="Postal Code"
              variant="standard"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              error={
                formik.touched.postalCode && Boolean(formik.errors.postalCode)
              }
              helperText={formik.touched.postalCode && formik.errors.postalCode}
            ></TextField>
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              id="creditCard_input"
              name="creditCard"
              label="Credit Card #"
              variant="standard"
              disabled
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="exp_input"
              name="exp"
              label="Exp"
              variant="standard"
              disabled
            ></TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="cvv_input"
              name="cvv"
              label="CVV"
              variant="standard"
              disabled
            ></TextField>
          </Grid>
          <Grid xsOffset={6} xs={6}>
            <div className="flex flex-row justify-end gap-2">
              <Button type="submit" variant="outlined" color="primary">
                Place Order
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ShoppingCart;
