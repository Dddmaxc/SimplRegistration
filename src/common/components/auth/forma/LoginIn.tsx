import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { closeOther } from "./slice-loginModal";
import { setUser, selectUser } from "./authSlice";
import style from "./login.module.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../../firebase";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { RootState } from "../../../../app/store";

export const LoginIn = () => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const open = useSelector(
    (state: RootState) => state.modalsForRegistr?.otherAuthOpen ?? false
  );

  const { name, email } = useSelector(selectUser);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;

    if (fieldName === "password") {
      setPassword(value);
    } else {
      dispatch(
        setUser({
          name: fieldName === "name" ? value : name,
          email: fieldName === "email" ? value : email,
          id: null,
          token: null,
          phoneNumber: null,
        })
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email!,
          password
        );
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        dispatch(
          setUser({
            name: user.displayName || "",
            email: user.email || "",
            token: idToken,
            id: user.uid,
            phoneNumber: null,
          })
        );

        dispatch(closeOther());
      } else {
        if (!name) throw new Error("Name is required for registration");

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email!,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: name,
        });

        const idToken = await user.getIdToken();

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: name,
          email: email,
          createdAt: Timestamp.fromDate(new Date()),
          lastLogin: Timestamp.fromDate(new Date()),
        });

        dispatch(
          setUser({
            name,
            email,
            token: idToken,
            id: user.uid,
            phoneNumber: null,
          })
        );

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
    setPassword(""); // Очистим пароль при переключении режима
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
          width: isMobile ? "90%" : "440px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
          <Typography className={style.boxExit}>Exit</Typography>
          <div
            onClick={() => dispatch(closeOther())}
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </div>
        </Box>

        <Divider sx={{ borderColor: "#ccc", mb: 2 }} />

        <Typography
          variant="h5"
          textAlign="center"
          mb={2}
          fontSize={isMobile ? "1.2rem" : "1.5rem"}
        >
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
            p: 1,
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
              required
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
            value={password}
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
            sx={{ height: "48px", fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              color="primary"
              onClick={toggleAuthMode}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
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
            pb: 2,
            fontSize: isMobile ? "0.85rem" : "1rem",
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
