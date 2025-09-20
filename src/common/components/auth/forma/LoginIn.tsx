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
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { closeOther } from "./slice-loginModal";
import { setUser, registrSelector } from "./slice-login";
import style from "./login.module.css";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../../firebase"; // убедись, что путь правильный

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { RootState } from "../../../../app/store";

export const LoginIn = () => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true); // переключение между входом и регистрацией
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = useSelector(
    (state: RootState) => state.modalsForRegistr?.otherAuthOpen ?? false
  );

  const { name, email, password } = useSelector(registrSelector);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;

    dispatch(
      setUser({
        name: fieldName === "name" ? value : name,
        email: fieldName === "email" ? value : email,
        password: fieldName === "password" ? value : password,
        token: null,
        id: null,
      })
    );
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    if (isLogin) {
      // Вход пользователя
      const userCredential = await signInWithEmailAndPassword(auth, email!, password!);
      const user = userCredential.user;

      // Получаем idToken (аутентификационный токен)
      const idToken = await user.getIdToken();

      // Сохраняем данные пользователя в Redux
      dispatch(
        setUser({
          name: user.displayName || "",
          email: user.email || "",
          password: "",
          token: idToken,  // <-- здесь idToken, а не refreshToken
          id: user.uid,
        })
      );

      console.log("User signed in:", user);
      dispatch(closeOther());
    } else {
      // Регистрация нового пользователя
      if (!name) {
        throw new Error("Name is required for registration");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email!, password!);
      const user = userCredential.user;

      // Обновляем профиль с именем
      await updateProfile(user, {
        displayName: name,
      });

      // Получаем idToken
      const idToken = await user.getIdToken();

      // Сохраняем пользователя в Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        createdAt: Timestamp.fromDate(new Date()),
        lastLogin: Timestamp.fromDate(new Date()),
      });

      // Сохраняем данные пользователя в Redux
      dispatch(
        setUser({
          name: name,
          email: email,
          password: "",
          token: idToken,  // <-- idToken вместо refreshToken
          id: user.uid,
        })
      );

      console.log("User registered:", user);
      dispatch(closeOther());
    }
  } catch (error: any) {
    console.error("Authentication error:", error);
    setError(error.message || "Authentication failed");
  } finally {
    setLoading(false);
  }
};

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
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
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography className={style.boxExit}>Exit</Typography>
          <div
            onClick={() => dispatch(closeOther())}
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </div>
        </Box>

        <Divider sx={{ borderColor: "#ccc", mb: 2 }} />

        <Typography variant="h5" textAlign="center" mb={2}>
          {isLogin ? "Sign In" : "Sign Up"}
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {!isLogin && (
            <TextField
              sx={GreenTextField}
              label="Name"
              name="name"
              value={name || ""}
              onChange={handleChange}
              fullWidth
              required={!isLogin}
              disabled={loading}
            />
          )}

          <TextField
            sx={GreenTextField}
            label="Email"
            name="email"
            type="email"
            value={email || ""}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
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
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ height: "48px" }}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              color="primary"
              onClick={toggleAuthMode}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </Typography>
        </Box>

        <Typography
          sx={{
            display: "block",
            textAlign: "center",
            color: "#246dacff",
            cursor: "pointer",
            mt: 2,
            "&:hover": {
              color: "red",
            },
          }}
        >
          Forgot password
        </Typography>
      </Box>
    </Modal>
  );
};
