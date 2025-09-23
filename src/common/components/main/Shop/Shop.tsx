import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../app/store";
import { fetchProductsTC } from "../../../../features/cart/ui/products/products-slice";
import { useEffect } from "react";
import { ProductCard } from "./Card";

export const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProductsTC());
  }, [dispatch]);

  return (
    <Container
      maxWidth={false}
      sx={{ mt: 8, maxWidth: "1520px", mx: "auto", height: "100%" }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 0.5,
          justifyContent: "center",
        }}
      >
        <ProductCard />
      </Box>
    </Container>
  );
};
