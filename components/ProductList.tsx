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
import { usePaginatedGetProducts } from "@/lib/hooks";
import { S3_BUCKET_URL } from "@/lib/utils";
import InfiniteScroll from "react-infinite-scroll-component";

// This is for formatting the price as U.S. currency
// From this SO question: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const currencyFormatter = new Intl.NumberFormat("en-US", {
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
  const { products, fetchProducts, hasMore } = usePaginatedGetProducts();

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchProducts}
      hasMore={hasMore}
      loader={
        <div className="flex flex-row justify-around">
          <CircularProgress />
        </div>
      }
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
    >
      {products.map((p) => (
        <Card
          key={p.id}
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
      ))}
    </InfiniteScroll>
  );
};

export default ProductList;
