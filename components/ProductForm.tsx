"use client";
import * as yup from "yup";
import { useFormik } from "formik";
import { Product } from "@/types/product";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MuiFileInput } from "mui-file-input";
import { Auth, API, Storage, Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { S3_BUCKET_URL } from "@/lib/utils";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

Amplify.configure({ ...awsconfig, ssr: true });
Storage.configure(awsconfig);
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
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelDialogOpen = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = (doCancel: boolean) => {
    setCancelDialogOpen(false);

    if (doCancel) {
      router.back();
    }
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

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
      let imageKey: string | null | undefined = product?.imageKey;

      if (file) {
        const filename = `${Date.now()}-${file.name}`;

        // upload the file to S3 and retrieve the S3 Key
        const filePutResult = await Storage.put(filename, file, {
          contentType: file.type,
        });

        imageKey = filePutResult.key;
      }

      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      const requestData = {
        headers: {
          Authorization: token,
        },
        body: { ...values, id: product?.id, imageKey },
      };

      await API.post("sallyapi", "/products", requestData);

      router.push("/product-admin");
    },
  });

  return (
    <>
      <h1 className="text-center text-xl tracking-wide text-gray-900">
        {mode === "create" ? "Create" : "Edit"} Product
      </h1>
      <form onSubmit={formik.handleSubmit}>
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
                formik.touched.description && Boolean(formik.errors.description)
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
          {product?.imageKey && (
            <Grid xs={12}>
              <p className="text-xs text-gray-500 mb-2">Current Image</p>
              <div>
                <Image
                  src={`${S3_BUCKET_URL}${product.imageKey}`}
                  height={300}
                  width={300}
                  alt={`Image for ${product.name}`}
                />
              </div>
            </Grid>
          )}
          <Grid xs={12}>
            <MuiFileInput
              value={file}
              onChange={handleFileChange}
              variant="standard"
              label="Upload product image"
              className="w-full"
            />
          </Grid>
          <Grid xsOffset={6} xs={6}>
            <div className="flex flex-row justify-end gap-2">
              <Button
                type="button"
                variant="text"
                color="error"
                onClick={handleCancelDialogOpen}
              >
                Cancel
              </Button>
              <Button type="submit" variant="outlined" color="primary">
                {mode === "create" ? "Create" : "Update"} Product
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel and go back?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelDialogClose(false)} color="error">
            No
          </Button>
          <Button onClick={() => handleCancelDialogClose(true)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductForm;
