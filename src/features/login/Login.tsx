import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { closeR } from "./slice-loginModal";
import { setUser, registrSelector } from "./slice-login"; // исправь путь при необходимости
import style from "./login.module.css";

import type { RootState } from "../../app/store";
import type { ChangeEvent, FormEvent } from "react";

export const Login = () => {
  const dispatch = useAppDispatch();

  const openR = useSelector(
    (state: RootState) =>
      state.modalsForRegistr?.buttonSwitchForRegistr ?? false
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
      open={openR}
      onClose={() => dispatch(closeR())}
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
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography className={style.boxExit}>Exit</Typography>
          <div onClick={() => dispatch(closeR())} style={{ cursor: "pointer" }}>
            <CloseIcon />
          </div>
        </Box>
        <hr />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
        </Box>
      </Box>
    </Modal>
  );
};
