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
      sx={{
        mt: { xs: 4, md: 8 },
        maxWidth: "1520px",
        mx: "auto",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
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
