import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import {
  TextField,
  Button,
  Box,
  Typography,
  Modal,
  Divider,
} from "@mui/material";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { closeR, openOther } from "../slice-loginModal";
import CloseIcon from "@mui/icons-material/Close";
import "../../../App.css";
import google from "../../../assets/images/google.png";
import apple from "../../../assets/images/apple.png";

import { auth, db } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult, } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const Registration = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const openR = useSelector(
    (state: RootState) =>
      state.modalsForRegistr?.buttonSwitchForRegistr ?? false
  );

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA успешно пройден
            },
            "expired-callback": () => {
              alert("Пожалуйста, подтвердите reCAPTCHA заново.");
            },
          }
        );
        
        window.recaptchaVerifier.render().catch((error) => {
          console.error("reCAPTCHA render error:", error);
        });
      }
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("reCAPTCHA setup error:", error);
      throw error;
    }
  };

  const handleSendCode = async () => {
    if (!phone || phone.length < 8) {
      alert("Введите корректный номер телефона");
      return;
    }
    setLoading(true);
    try {
      const appVerifier = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+${phone}`,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setStep("code");
    } catch (error: any) {
      console.error("Ошибка отправки кода:", error);
      alert("Ошибка при отправке SMS. Попробуйте позже.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      alert("Введите корректный код из 6 цифр");
      return;
    }
    if (!confirmationResult) {
      alert("Сессия подтверждения не найдена. Попробуйте отправить код снова.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      alert("✅ Успешная авторизация!");

      const user = userCredential.user;

      // Сохраняем профиль пользователя в Firestore
      await setDoc(doc(db, "users", user.uid), {
        phoneNumber: user.phoneNumber,
        createdAt: new Date(),
      });

      dispatch(closeR());
      
      // Очищаем reCAPTCHA после успешной авторизации
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } catch (error: any) {
      alert("❌ Неверный код или срок действия кода истек");
      console.error("Ошибка подтверждения кода:", error);
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setStep("phone");
    setCode("");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
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
          width: "440px",
          minHeight: "507px",
          mx: "auto",
          mt: 28,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#fff",
          borderRadius: "10px",
          border: "none",
          p: 2,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            className="boxExit"
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 1,
          }}
        >
          {step === "phone" && (
            <>
              <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
                Введите номер телефона
              </Typography>
              <PhoneInput
                country={"ua"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{ 
                  width: "100%",
                  height: "56px",
                  fontSize: "16px"
                }}
                containerClass="greenPhoneInput"
                placeholder="Введите номер телефона"
              />
              <div id="recaptcha"></div>
              <Button
                color="success"
                variant="contained"
                onClick={handleSendCode}
                disabled={loading || !phone}
                fullWidth
                sx={{ height: "48px", fontSize: "16px" }}
              >
                {loading ? "Отправка..." : "Продолжить"}
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
                Введите код из SMS
              </Typography>
              <TextField
                label="Код из SMS"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                fullWidth
                type="tel"
                inputProps={{ maxLength: 6 }}
                placeholder="000000"
              />
              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={loading || code.length < 6}
                fullWidth
                sx={{ height: "48px", fontSize: "16px", mb: 1 }}
              >
                {loading ? "Проверка..." : "Подтвердить"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleResendCode}
                disabled={loading}
                fullWidth
                sx={{ height: "48px", fontSize: "14px" }}
              >
                Отправить код повторно
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
          <span style={{ textDecoration: "underline", margin: 0 }}>
            BarcaCCG account
          </span>{" "}
          and consent to{" "}
          <span style={{ textDecoration: "underline", margin: 0 }}>
            the processing of personal data
          </span>
        </Typography>

        <Divider sx={{ borderColor: "#ccc", my: 2 }}>or</Divider>

        <Box
          sx={{
            width: "408px",
            height: "46px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            m: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
            cursor: "pointer",
            mb: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <img
            style={{ width: "24px", height: "24px" }}
            src={google}
            alt="google-Img"
          />
          <Typography
            component="p"
            sx={{ fontWeight: "700", letterSpacing: "1px" }}
          >
            Login in to Google
          </Typography>
        </Box>

        <Box
          sx={{
            width: "408px",
            height: "46px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            m: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
            cursor: "pointer",
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <img
            style={{ width: "24px", height: "24px" }}
            src={apple}
            alt="apple-Img"
          />
          <Typography
            component="p"
            sx={{ fontWeight: "700", letterSpacing: "1px" }}
          >
            Login in to Apple
          </Typography>
        </Box>

        <Typography
          onClick={() => {
            dispatch(closeR());
            dispatch(openOther());
          }}
          sx={{
            fontWeight: "400",
            letterSpacing: "1px",
            textAlign: "center",
            color: "#246dacff",
            cursor: "pointer",
            fontSize: "15px",
            mt: 2,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Other authorization methods
        </Typography>
      </Box>
    </Modal>
  );
};