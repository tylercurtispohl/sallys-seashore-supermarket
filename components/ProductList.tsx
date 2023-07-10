"use client";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useGetProducts } from "@/lib/hooks";
import { S3_BUCKET_URL } from "@/lib/utils";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProductList = ({
  actionLink,
  showStockQuantity,
}: {
  actionLink: string;
  showStockQuantity?: boolean | undefined;
}) => {
  const { products, isLoading } = useGetProducts();

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
                      image={`${S3_BUCKET_URL}${p.imageKey}`}
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
                      {showStockQuantity && (
                        <Typography variant="body1" component="p">
                          {p.stockQuantity} in stock
                        </Typography>
                      )}
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
