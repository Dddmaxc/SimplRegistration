import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { openO } from "../../../features/cart/slice-modals";
import { openR } from "../auth/forma/slice-loginModal";
import Barca from "../../../assets/images/logoBarca.svg";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { selectQuantity } from "../../../features/cart/ui/slice-cart";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAuth, signOut } from "firebase/auth";
import { clearUser, selectUserId } from "../auth/forma/authSlice";
import PermIdentitySharpIcon from "@mui/icons-material/PermIdentitySharp";
import { useAppSelector } from "../../hooks/selector";

export const Header = () => {
  const quantity = useAppSelector(selectQuantity);
  const userId = useAppSelector(selectUserId);
  const dispatch = useAppDispatch();

  const handleCartOpen = () => {
    dispatch(openO());
  };

  const handleLoginOpen = () => {
    dispatch(openR());
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    dispatch(clearUser());
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
        <Toolbar sx={{ display: "flex"}}>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, mt: "5px", cursor: "pointer" }}
          >
            <Button sx={{ borderRadius: "50%" }} component={RouterLink} to="/">
              <img src={Barca} alt="logo" width={50} height={50} />
            </Button>
          </Typography>

          <Stack direction="row-reverse" >
            {!userId && (
              <IconButton onClick={handleLoginOpen}>
                <PermIdentitySharpIcon
                  sx={{ width: 40, height: 33, color: "white" }}
                />
              </IconButton>
            )}

            {userId && (
              <>
                <IconButton onClick={handleCartOpen}>
                  <ShoppingCartIcon
                    sx={{ width: 30, height: 30, color: "white" }}
                  />
                  <CartBadge
                    badgeContent={quantity}
                    color="warning"
                    overlap="circular"
                  />
                </IconButton>

                <IconButton onClick={handleLogout}>
                  <LogoutIcon sx={{ width: 30, height: 30, color: "white" }} />
                </IconButton>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
