"use client";
import * as yup from "yup";
import { useFormik } from "formik";
import { Product } from "@/types/product";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MuiFileInput } from "mui-file-input";
import { Auth, API } from "aws-amplify";
import awsconfig from "../src/aws-exports";

Auth.configure(awsconfig);

const validationSchema = yup.object({
  name: yup.string().nullable().required("Name is required"),
  description: yup.string().nullable().notRequired(),
  //   category: yup.string().nullable().notRequired(),
  price: yup
    .number()
    .nullable()
    .required("Price is required")
    .min(0, "Price must be a positive number"),
  stockQuantity: yup
    .number()
    .nullable()
    .required("Stock Quantity is required")
    .min(0, "Stock Quantity must be a positive number"),
});

const ProductForm = ({
  mode,
  product,
}: {
  mode: "edit" | "create";
  product?: Product | undefined;
}) => {
  const formik = useFormik({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      //   category: product?.category ?? null,
      price: typeof product?.price === "undefined" ? "" : product.price,
      stockQuantity:
        typeof product?.stockQuantity === "undefined"
          ? ""
          : product.stockQuantity,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      console.log(token);
      const requestData = {
        headers: {
          Authorization: token,
        },
        body: values,
      };
      const responseData = await API.post("sallyapi", "/products", requestData);
      console.log(responseData);
    },
  });

  return (
    <>
      <h1 className="text-center text-xl font-semibold tracking-wider text-cyan-500">
        {mode === "create" ? "Create" : "Edit"} Product
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-row justify-around">
          <div className="w-full md:w-2/3 xl:w-1/2">
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  id="product_name_input"
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
                  multiline
                  minRows={4}
                  maxRows={8}
                  id="product_description_input"
                  name="description"
                  label="Description"
                  variant="standard"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                ></TextField>
              </Grid>
              <Grid xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="product_price_input"
                  name="price"
                  label="Price"
                  variant="standard"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                ></TextField>
              </Grid>
              <Grid xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="product_stock_quantity_input"
                  name="stockQuantity"
                  label="Stock Quantity"
                  variant="standard"
                  value={formik.values.stockQuantity}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.stockQuantity &&
                    Boolean(formik.errors.stockQuantity)
                  }
                  helperText={
                    formik.touched.stockQuantity && formik.errors.stockQuantity
                  }
                ></TextField>
              </Grid>
              <Grid xsOffset={6} xs={6}>
                <div className="flex flex-row justify-end gap-2">
                  <Button type="button" variant="text" color="error">
                    Cancel
                  </Button>
                  <Button type="submit" variant="outlined" color="primary">
                    Submit
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
