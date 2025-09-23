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
import { closeC } from "../slice-modals"; // импортируем action закрытия корзины

export const Cart = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = useSelector((state: RootState) => state.cart.items);
  const open = useSelector(
    (state: RootState) => state.modals?.buttonSwitch ?? false
  ); // состояние открытия корзины из cartModal
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
    <Modal
      sx={{ border: 0 }}
      keepMounted
      open={open}
      onClose={() => dispatch(closeC())}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: 500,
          width: 960,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          border: 0,
          p: "16px",
        }}
      >
        <Typography variant="h6" component="h2">
          <div className={style.headerCart}>
            <div>Cart</div>
            <div
              onClick={() => dispatch(closeC())}
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </div>
          </div>
        </Typography>

        <hr style={{ borderColor: "#fdfcfcff" }} />

        <Box
          component="div"
          sx={{
            mt: 2,
            maxHeight: 380,
            overflowY: "auto",
          }}
        >
          {items.length > 0 ? (
            <div>
              {items.map((el) => {
                const handleDecreaseQuantity = () => {
                  dispatch(decreaseQuantity(el.id));
                };

                const handleIncreaseQuantity = () => {
                  const { id, name, imageUrl, price } = el;
                  dispatch(addToCart({ id, name, imageUrl, price }));
                };

                return (
                  <Box
                    key={el.id}
                    component="div"
                    sx={{
                      width: "100",
                      border: "1px solid #d2d2d2",
                      height: "80px",
                      p: "16px",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      mb: 2,
                      cursor: "pointer",
                    }}
                  >
                    <div className={style.containerImgInsideCart}>
                      <img
                        className={style.imgInsideCart}
                        src={el.imageUrl}
                        alt="img"
                      />
                      <Typography
                        component="div"
                        sx={{
                          width: "422px",
                          fontSize: "14px",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {el.name}
                      </Typography>
                    </div>

                    <Box
                      sx={{ display: "flex", width: "145px", height: "40px" }}
                    >
                      <Button
                        sx={{
                          width: "40px",
                          height: "40px",
                          minWidth: 0,
                          padding: 0,
                        }}
                        onClick={handleDecreaseQuantity}
                        disabled={el.quantity === 1}
                      >
                        <RemoveIcon />
                      </Button>
                      <Box
                        component={"div"}
                        sx={{
                          width: "56px",
                          height: "40px",
                          border: "1px solid #a6a5a5",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        {el.quantity}
                      </Box>
                      <Button
                        sx={{
                          width: "40px",
                          height: "40px",
                          minWidth: 0,
                          padding: 0,
                        }}
                        onClick={handleIncreaseQuantity}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                    <Box component={"div"} sx={{ width: "120px" }}>
                      <Typography
                        sx={{
                          textAlign: "right",
                          fontSize: "1.1rem",
                          fontWeight: "700",
                          lineHeight: "1",
                          color: "#000",
                          fontFamily: "'Inter', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        {el.price * el.quantity}$
                      </Typography>
                    </Box>

                    <Button
                      aria-describedby={`popover-${el.id}`}
                      onClick={(e) => handleClick(e, el.id)}
                    >
                      <img
                        style={{ width: "40px", height: "40px" }}
                        src={eli}
                        alt="options"
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
                      sx={{ boxShadow: "none" }}
                    >
                      <Box
                        onClick={() => handleRemove(el.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                          p: 2,
                          "&:hover": {
                            color: "#d32f2f",
                          },
                        }}
                      >
                        <DeleteIcon />
                        Remove
                      </Box>
                    </Popover>
                    {}
                  </Box>
                );
              })}
            </div>
          ) : (
            <div className={style.cartContainer}>
              <img src={cart} alt="cart" width={220} height={180} />
              <h3>Shopping Cart is empty</h3>
              <div>But it's never too late to fix it</div>
            </div>
          )}
        </Box>
        {items.length ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              m: 1,
              p: 1,
              alignItems: "center",
              gap: "35px",
              background: "#2e7d320d  ",
              borderRadius: "4px",
              width: "30%",
              ml: "66.8%",
            }}
          >
            <Box
              sx={{
                fontSize: "xx-large",
                color: "#000",
                fontWeight: "700",
                lineHeight: "1",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
              }}
            >
              {totalPrice}$
            </Box>
            <Button color="success" variant="outlined">
              Go to pay
            </Button>
          </Box>
        ) : null}
      </Box>
    </Modal>
  );
};
