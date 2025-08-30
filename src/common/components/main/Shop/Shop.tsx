import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import cart from "../../../../assets/images/cart.png";
import styled from "./shop.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  type CartItem,
} from "../../../../features/cart/ui/slice-cart";
import type { RootState } from "../../../../app/store";
import checkedCartIcon from "../../../../assets/images/selected.svg";
import { initialProducts } from "./initialProducts";

export const Shop = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch(addToCart(product));
  };

  return (
    <Container maxWidth={false} sx={{ mt: 8, maxWidth: "1800px", mx: "auto" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)", // до 600px
            sm: "repeat(3, 1fr)", // ≥600px
            md: "repeat(4, 1fr)", // ≥900px
            lg: "repeat(5, 1fr)", // ≥1200px
            xl: "repeat(6, 1fr)", // ≥1536px
          },
          gap: 2,
          justifyContent: "center",
        }}
      >
        {initialProducts.map((product) => {
          const isInCart = cartItems.some((item) => item.id === product.id);

          return (
            <Card
              key={product.id}
              sx={{
                width: "100%",
                maxWidth: "178px",
                height: "292px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 1,
                mx: "auto",
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{ width: "100%", height: "161px", objectFit: "contain" }}
              />
              <CardContent sx={{ mt: 2, p: 0 }}>
                <Typography
                  component="div"
                  sx={{
                    color: "#595656",
                    padding: 0,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.4em",
                    maxHeight: "5.6em",
                    wordBreak: "break-word",
                    fontSize: "clamp(0.75rem, 1vw + 0.2rem, 0.875rem)",
                  }}
                  variant="subtitle1"
                >
                  {product.title}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Box
                  component="div"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    lineHeight: "1",
                    color: "#000",
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {product.price} $
                </Box>
                <img
                  className={styled.imgCart}
                  src={isInCart ? checkedCartIcon : cart}
                  alt="cart"
                  onClick={() => {
                    if (!isInCart) {
                      handleAddToCart(product);
                    }
                  }}
                />
              </Box>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};
