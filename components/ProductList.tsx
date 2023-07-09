"use client";
import { Amplify, API, Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

// TODO: put this in an env var
const s3BucketUrl =
  "https://sallybucket102515-main.s3.us-west-1.amazonaws.com/public/";

// This is for formatting the price as currency later on
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductList = ({ actionLink }: { actionLink: string }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      const token = authenticatedUser.signInUserSession.idToken.jwtToken;

      const requestData = {
        headers: {
          Authorization: token,
        },
      };

      const data = await API.get("sallyapi", "/products", requestData);

      setProducts(data.Items);
      setIsLoading(false);
    };

    if (!products) {
      getProducts();
    }
  }, [products]);

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      ) : (
        products && (
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid key={p.id} xs={12} sm={6} lg={4} xl={3}>
                <Card
                  className="cursor-pointer"
                  onClick={() => console.log("clicked")}
                >
                  <CardActionArea href={`${actionLink}/${p.id}`}>
                    <CardMedia
                      image={`${s3BucketUrl}${p.imageKey}`}
                      title={`${p.name}`}
                      className="h-52"
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        className="text-ellipsis"
                      >
                        {p.name}
                      </Typography>
                      <Typography variant="body1" component="p">
                        {currencyFormatter.format(p.price)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </div>
  );
};

export default ProductList;
