import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import style from "./cart.module.css";
import cart from "../../../assets/images/shoppingCart.png";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import eli from "../../../assets/images/ellipsis.svg";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { addToCart, decreaseQuantity, removeFromCart } from "./slice-cart";
import { closeC } from "../slice-modals";
import { Divider, useMediaQuery, useTheme } from "@mui/material";

export const Cart = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const items = useSelector((state: RootState) => state.cart.items);
  const open = useSelector(
    (state: RootState) => state.modals?.buttonSwitch ?? false
  );
  const dispatch = useDispatch();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(id);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    handleClosePopover();
  };

  const totalPrice = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <Modal keepMounted open={open} onClose={() => dispatch(closeC())}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : "960px",
          height: isMobile ? "auto" : 500,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ p: isMobile ? 1 : 2 }}>
          <Box
            className={style.headerCart}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Cart</Typography>
            <CloseIcon
              onClick={() => dispatch(closeC())}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#ccc" }} />

        {/* Items */}
        <Box
          sx={{
            mt: 2,
            maxHeight: isMobile ? "50vh" : 380,
            overflowY: "auto",
            px: isMobile ? 1 : 2,
          }}
        >
          {items.length > 0 ? (
            items.map((el) => {
              const handleDecreaseQuantity = () =>
                dispatch(decreaseQuantity(el.id));
              const handleIncreaseQuantity = () =>
                dispatch(
                  addToCart({
                    id: el.id,
                    name: el.name,
                    imageUrl: el.imageUrl,
                    price: el.price,
                  })
                );

              return (
                <Box
                  key={el.id}
                  sx={{
                    border: "1px solid #d2d2d2",
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    className={style.containerImgInsideCart}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 0 : 2,
                      width: isMobile ? "auto" : "400px",
                    }}
                  >
                    <img
                      className={style.imgInsideCart}
                      src={el.imageUrl}
                      alt="img"
                      style={{
                        width: isMobile ? 60 : 80,
                        height: isMobile ? 60 : 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isMobile ? "100%" : "250px",
                      }}
                    >
                      {el.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 0 : 1,
                    }}
                  >
                    <Button
                      sx={{
                        minWidth: 0,
                        width: 36,
                        height: 36,
                        padding: 0,
                      }}
                      onClick={handleDecreaseQuantity}
                      disabled={el.quantity === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <Box
                      sx={{
                        width: isMobile ? 20 : 40,
                        height: isMobile ? 20 : 36,
                        border: "1px solid #a6a5a5",
                        borderRadius: isMobile ? "4px" : "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {el.quantity}
                    </Box>
                    <Button
                      sx={{
                        minWidth: 0,
                        width: 36,
                        height: 36,
                        padding: 0,
                      }}
                      onClick={handleIncreaseQuantity}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                  </Box>

                  <Box sx={{ ml: "auto", mr: isMobile ? 0 : 2 }}>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#000",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {el.price * el.quantity}$
                    </Typography>
                  </Box>

                  {/* Popover */}
                  <Button
                    aria-describedby={`popover-${el.id}`}
                    onClick={(e) => handleClick(e, el.id)}
                  >
                    <img
                      src={eli}
                      alt="options"
                      style={{ width: 36, height: 36 }}
                    />
                  </Button>

                  <Popover
                    id={`popover-${el.id}`}
                    open={Boolean(anchorEl) && selectedItemId === el.id}
                    onClose={handleClosePopover}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Box
                      onClick={() => handleRemove(el.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 2,
                        cursor: "pointer",
                        "&:hover": { color: "#d32f2f" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                      Remove
                    </Box>
                  </Popover>
                </Box>
              );
            })
          ) : (
            <Box
              className={style.cartContainer}
              sx={{ textAlign: "center", mt: 4 }}
            >
              <img
                src={cart}
                alt="cart"
                width={isMobile ? 180 : 220}
                height={isMobile ? 140 : 180}
              />
              <Typography variant="h6">Shopping Cart is empty</Typography>
              <Typography variant="body2">
                But it's never too late to fix it
              </Typography>
            </Box>
          )}
        </Box>
        <Divider sx={{ borderColor: "#ccc" }} />
        {items.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "flex-end",
              alignItems: "center",
              gap: isMobile ? 1.5 : 3,
              borderRadius: 2,
              px: isMobile ? 2 : 4,
              py: isMobile ? 1.5 : 2,
              mt: isMobile ? 2 : 0,
              background:
                "linear-gradient(180deg, rgb(255, 255, 255), rgba(182, 179, 244, 1) 89%)",
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? "16px" : "24px",
                fontWeight: 700,
                color: "#000",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {totalPrice}$
            </Typography>

            <Button
              sx={{
                background: isMobile ? "none" : "#2e7d320d",
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "12px" : "16px",
                padding: isMobile ? "8px 12px" : "10px 20px",
              }}
              color="success"
              variant="outlined"
            >
              Go to pay
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
