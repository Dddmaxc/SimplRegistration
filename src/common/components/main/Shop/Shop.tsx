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
import type { AppDispatch, RootState } from "../../../../app/store";
import checkedCartIcon from "../../../../assets/images/selected.svg";
import {
  fetchProductsTC,
  selectProducts,
} from "../../../../features/cart/ui/products/products-slice";
import { useEffect } from "react";

export const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProductsTC());
  }, [dispatch]);

  const handleAddToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch(addToCart(product));
  };

  return (
    <Container maxWidth={false} sx={{ mt: 8, maxWidth: "1800px", mx: "auto" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
            xl: "repeat(6, 1fr)",
          },
          gap: 2,
          justifyContent: "center",
        }}
      >
        {products.map((product) => {
          // ✅ Исправлено: используем product.id для сравнения
          const isInCart = cartItems.some((item) => item.id === product.id);

          return (
            <Card
              key={product.id} // ✅ Исправлено: используем product.id как ключ
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
                image={product.imageUrl}
                alt={product.name}
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
                  {product.name}
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
                    // ✅ Исправлено: используем product.id
                    if (!isInCart && product.id) {
                      handleAddToCart({
                        id: product.id, // ✅ Исправлено: используем product.id
                        price: product.price,
                        name: product.name,
                        imageUrl: product.imageUrl,
                      });
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
