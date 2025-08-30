import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { closeOther } from "./slice-loginModal";
import { setUser, registrSelector } from "./slice-login"; // исправь путь при необходимости
import style from "./login.module.css";

import type { RootState } from "../../app/store";
import type { ChangeEvent, FormEvent } from "react";

export const LoginIn = () => {
  const dispatch = useAppDispatch();

  const open = useSelector(
    (state: RootState) => state.modalsForRegistr?.otherAuthOpen ?? false
  );

  const { name, email, password } = useSelector(registrSelector);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // обновляем только одно поле
    dispatch(
      setUser({
        name: name === "name" ? value : name === "email" ? name : null,
        email: name === "email" ? value : email,
        password: name === "password" ? value : password,
        token: null,
        id: null,
      })
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Здесь можно отправить данные на сервер, вызвать Firebase и т.д.
    console.log("Submitting:", { name, email, password });
  };

  const GreenTextField = {
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "green",
    },
  };

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeOther())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "440px",
          height: "401px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Typography className={style.boxExit}>Exit</Typography>
          <div
            onClick={() => dispatch(closeOther())}
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </div>
        </Box>
        <Divider sx={{ borderColor: "#ccc !impotent" }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            m: "28px 16px 16px 16px",
          }}
        >
          <TextField
            sx={GreenTextField}
            label="Name"
            name="name"
            value={name || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            sx={GreenTextField}
            label="Email"
            name="email"
            type="email"
            value={email || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            sx={GreenTextField}
            label="Password"
            name="password"
            type="password"
            value={password || ""}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="success">
            Send
          </Button>
          <Typography
            sx={{
              display: "inline",
              fontWeight: "400",
              letterSpacing: "1px",
              textAlign: "center",
              color: "#246dacff",
              cursor: "pointer",
              fontSize: "15px",
              "&:hover": {
                color: "red",
              },
            }}
          >
            forgot password
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
