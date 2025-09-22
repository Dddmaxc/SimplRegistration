import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Login } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { openO } from "../../../features/cart/slice-modals";
import { openR } from "../auth/forma/slice-loginModal";
import Barca from "../../../assets/images/logoBarca.svg";

export const Header = () => {
  const quantity = useSelector((state: RootState) => state.cart.items.length);
  const dispatch = useAppDispatch();
  const openHandler = () => {
    dispatch(openO());
  };
  const openForRHandler = () => {
    dispatch(openR());
  };

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: 6px;
    }
  `;

  return (
    <Box sx={{ flexGrow: 1, mt: 7.2 }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#17234a", color: "#fff", p: "0 30px 0 35px" }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, mt: "5px", cursor: "pointer" }}
          >
            <img src={Barca} alt="logo" width={50} height={50} />
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton onClick={openForRHandler}>
              <Login sx={{ width: 30, height: 30, color: "white" }} />
            </IconButton>
            <IconButton onClick={openHandler}>
              <ShoppingCartIcon
                sx={{ width: 30, height: 30, color: "white" }}
              />
              <CartBadge
                badgeContent={quantity}
                color="warning"
                overlap="circular"
              />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
