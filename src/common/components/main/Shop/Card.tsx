import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../app/store";
import {
  fetchProductsTC,
  selectProducts,
} from "../../../../features/cart/ui/products/products-slice";
import {
  addToCart,
  type CartItem,
} from "../../../../features/cart/ui/slice-cart"; // Импортируйте ваш action
import { useEffect } from "react";
import Add from "@mui/icons-material/Add";

export const ProductCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector(selectProducts);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchProductsTC());
  }, [dispatch]);

  const handleAddToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch(addToCart(product));
  };

  return (
    <>
      {products.map((product) => {
        const isInCart = cartItems.some((item) => item.id === product.id);
        return (
          <Card
            key={product.id}
            sx={{
              width: isMobile ? "195px" : "365px",
              height: isMobile ? "285px" : "500px",
              transition: "0.3s",
              "&:hover": { transform: "translateY(-4px)" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={product.imageUrl}
              alt={product.name}
              sx={{
                objectFit: "inherit",
                maxWidth: "100",
                display: "flex",
                pt: isMobile ? 0 : 6,
              }}
            />

            <CardContent>
              <Typography
                gutterBottom
                component="div"
                sx={{
                  fontSize: "20",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                <Button
                  startIcon={<Add />}
                  variant={isInCart ? "outlined" : "contained"}
                  onClick={() => {
                    if (!isInCart && product.id) {
                      handleAddToCart({
                        id: product.id,
                        price: product.price,
                        name: product.name,
                        imageUrl: product.imageUrl,
                      });
                    }
                  }}
                >
                  {isMobile ? "add" : "Add to cart"}
                  
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
