import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import {
  TextField,
  Button,
  Box,
  Typography,
  Modal,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import google from "../../../../assets/images/google.png";
import apple from "../../../../assets/images/apple.png";
import "../../../../App.css";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import {
  closeR,
  openOther,
  sModalsForRegistr,
} from "../forma/slice-loginModal";
import { auth, db } from "../../../../firebase";
import { setUser } from "../forma/authSlice";
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const Registration = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const { buttonSwitchForRegistr } = useSelector(sModalsForRegistr);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        // Если reCAPTCHA инициализирован
        window.recaptchaVerifier.clear(); // Очищает reCAPTCHA из DOM
        window.recaptchaVerifier = undefined; // Удаляет ссылку
      }
    };
  }, []);
  // Функция для настройки reCAPTCHA
  const setupRecaptcha = () => {
    // Инициализация reCAPTCHA
    if (!window.recaptchaVerifier) {
      // Если еще не инициализирован
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          alert("Please confirm reCAPTCHA again.");
        }, // Обработчик истечения срока действия reCAPTCHA
      });

      window.recaptchaVerifier.render().catch((error) => {
        console.error("reCAPTCHA rendering error:", error);
      }); // Рендеринг reCAPTCHA
    }
    return window.recaptchaVerifier; // Возвращаем экземпляр reCAPTCHA
  };
  // Отправка кода на указанный номер телефона
const handleSendCode = async () => {
  if (!phone || phone.length < 8) {
    alert("Please enter a valid phone number");
    return;
  }
  setLoading(true);
  try {
    const appVerifier = setupRecaptcha();
    const confirmation = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
    setConfirmationResult(confirmation);
    setStep("code");
    // УДАЛЯЕМ обновление Redux здесь
  } catch (error) {
    alert("Error sending SMS. Try again later.");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  } finally {
    setLoading(false);
  }
};

const handleVerifyCode = async () => {
  if (!code || code.length < 6) {
    alert("Please enter the correct code");
    return;
  }
  if (!confirmationResult) {
    alert("Confirmation session not found. Please try again.");
    return;
  }
  setLoading(true);
  try {
    const userCredential = await confirmationResult.confirm(code);
    const userFromFirebase = userCredential.user;

    await setDoc(doc(db, "users", userFromFirebase.uid), {
      uid: userFromFirebase.uid,
      phoneNumber: userFromFirebase.phoneNumber,
      createdAt: new Date(),
    });

    dispatch(
      setUser({
        id: userFromFirebase.uid,
        phoneNumber: userFromFirebase.phoneNumber || "",
        token: userFromFirebase.refreshToken,
        email: userFromFirebase.email || "",
        name: userFromFirebase.displayName || "",
      })
    );

    alert("Successful authorization!");
    dispatch(closeR());
    setStep("phone");
    setCode("");
    setPhone("");

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  } catch (error) {
    alert("Invalid code or expired session. Please try again.");
  } finally {
    setLoading(false);
  }
};
  // Повторная отправка кода
  const handleResendCode = () => {
    setStep("phone");
    setCode("");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  };

  return (
    <Modal
      open={buttonSwitchForRegistr}
      onClose={() => dispatch(closeR())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: isMobile ? "96%" : "440px",
          minHeight: "507px",
          mx: "auto",
          mt: isMobile ? 20 : 28,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 1 : 2,
          bgcolor: "#fff",
          borderRadius: "10px",
          border: "none",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "16px 16px 0 16px",
          }}
        >
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => dispatch(closeR())}
          >
            Exit
          </Typography>
          <div onClick={() => dispatch(closeR())} style={{ cursor: "pointer" }}>
            <CloseIcon />
          </div>
        </Box>

        <Divider sx={{ borderColor: "#ccc", mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
          {step === "phone" && (
            <>
              <PhoneInput
                country={"ua"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  fontSize: "16px",
                }}
                containerClass="greenPhoneInput"
                placeholder="Enter your phone number"
              />
              <div id="recaptcha"></div>
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={loading || phone.length < 8}
                onClick={handleSendCode}
                sx={{ height: "48px", fontSize: "16px" }}
              >
                {loading ? "Sending..." : "Continue"}
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <TextField
                label="Cod from sms"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 6 }}
                type="tel"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={loading || code.length < 6}
                fullWidth
                sx={{ height: "48px", fontSize: "16px" }}
              >
                {loading ? "Sending..." : "Continue"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleResendCode}
                disabled={loading}
                fullWidth
              >
                Resend code
              </Button>
            </>
          )}
        </Box>

        <Typography
          component={"p"}
          sx={{
            px: 2,
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
            mt: 2,
          }}
        >
          By continuing, you confirm that you agree to log in to your{" "}
          <span style={{ textDecoration: "underline" }}>BarcaCCG account</span>{" "}
          and consent to{" "}
          <span style={{ textDecoration: "underline" }}>
            the processing of personal data
          </span>
        </Typography>

        <Divider sx={{ borderColor: "#ccc", my: 2 }}>or</Divider>

        <Box
          sx={{
            width: isMobile ? "95%" : "408px",
            height: "46px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
            cursor: "pointer",
            mb: 1,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <img src={google} alt="google-Img" width={24} height={24} />
          <Typography sx={{ fontWeight: 700 }}>Login in to Google</Typography>
        </Box>

        <Box
          sx={{
            width: isMobile ? "95%" : "408px",
            height: "46px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <img src={apple} alt="apple-Img" width={24} height={24} />
          <Typography sx={{ fontWeight: 700 }}>Login in to Apple</Typography>
        </Box>

        <Typography
          onClick={() => {
            dispatch(closeR());
            dispatch(openOther());
          }}
          sx={{
            fontSize: "15px",
            textAlign: "center",
            color: "#246dac",
            cursor: "pointer",
            mt: 2,
            pb: 2,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Other login options
        </Typography>
      </Box>
    </Modal>
  );
};
