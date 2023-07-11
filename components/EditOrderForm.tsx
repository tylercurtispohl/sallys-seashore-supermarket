"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Auth, API, Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useRouter } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Order } from "@/types/order";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DateTime } from "luxon";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string().notRequired(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup.string().required("Postal Code is required"),
  status: yup.string().notRequired(),
  trackingNumber: yup.string().notRequired(),
});

const EditOrderForm = ({ order }: { order: Order }) => {
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

  const formik = useFormik({
    initialValues: {
      name: order.name || "",
      addressLine1: order.addressLine1 || "",
      addressLine2: order.addressLine2 || "",
      city: order.city || "",
      state: order.state || "",
      postalCode: order.postalCode || "",
      status: order.status || "",
      trackingNumber: order.trackingNumber || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      const requestData = {
        headers: {
          Authorization: token,
        },
        body: { ...order, ...values },
      };

      await API.put("sallyapi", "/orders", requestData);

      router.push("/order-admin");
    },
  });

  return (
    <>
      <h1 className="text-xl tracking-wide text-gray-900 text-center w-full">
        Edit Order {order.id}
      </h1>
      <p className="text-lg tracking-wide text-gray-900 text-center w-full">
        Created{" "}
        {DateTime.fromISO(order.createdAt).toLocaleString(
          DateTime.DATETIME_SHORT
        )}
      </p>
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
          <Grid xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="status_label">Status</InputLabel>
              <Select
                labelId="status_label"
                id="status_input"
                value={formik.values.status}
                label="Status"
                name="status"
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value="processing">processing</MenuItem>
                <MenuItem value="shipped">shipped</MenuItem>
                <MenuItem value="delivered">delivered</MenuItem>
                <MenuItem value="cancelled">cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              id="trackingNumber_input"
              name="trackingNumber"
              label="Tracking Number"
              variant="standard"
              value={formik.values.trackingNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.trackingNumber &&
                Boolean(formik.errors.trackingNumber)
              }
              helperText={
                formik.touched.trackingNumber && formik.errors.trackingNumber
              }
            ></TextField>
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
                Update Order
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

export default EditOrderForm;
