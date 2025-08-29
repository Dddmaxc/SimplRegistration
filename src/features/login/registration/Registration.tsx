import { useState } from "react";
import { auth } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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
import { closeR } from "../slice-loginModal";
import CloseIcon from "@mui/icons-material/Close";
import "../../../App.css";
import google from "../../../assets/images/google.png";
import apple from "../../../assets/images/apple.png";

declare global {
  interface Window {
    recaptchaVerifier?: import("firebase/auth").RecaptchaVerifier;
  }
}

export const Registration = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState<"phone" | "code">("phone");

  const dispatch = useAppDispatch();
  const openR = useSelector(
    (state: RootState) =>
      state.modalsForRegistr?.buttonSwitchForRegistr ?? false
  );

  const handleSendCode = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: () => handleSendCode(),
      });
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(
        auth,
        `+${phone}`,
        appVerifier
      );
      setConfirmationResult(result);
      setStep("code");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await confirmationResult.confirm(code);
      alert("✅ Успешная авторизация!");
    } catch (error: any) {
      alert("❌ Неверный код");
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
          height: "507px",
          mx: "auto",
          mt: 28,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#fff",
          borderRadius: "10px",
          border: "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Typography className="boxExit">Exit</Typography>
          <div onClick={() => dispatch(closeR())} style={{ cursor: "pointer" }}>
            <CloseIcon />
          </div>
        </Box>

        <Divider sx={{ borderColor: "#ccc", mt: "-25px" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 2,
          }}
        >
          {step === "phone" && (
            <>
              <PhoneInput
                country={"ua"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{ width: "100%" }}
                containerClass="greenPhoneInput" // подключай свой CSS здесь
              />
              <div id="recaptcha"></div>
              <Button
                color="success"
                variant="contained"
                onClick={handleSendCode}
              >
                Continue
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <TextField
                label="Enter code from SMS"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleVerifyCode}>
                Confirm
              </Button>
            </>
          )}
        </Box>
        <Typography
          component={"p"}
          sx={{ px: 2, fontSize: "12px", color: "#666", textAlign: "center" }}
        >
          By continuing, you confirm that you agree to log in to your{" "}
          <span style={{ textDecoration: "underline", margin: "0" }}>
            BarcaCCG account
          </span>{" "}
          and consent to{" "}
          <span style={{ textDecoration: "underline", margin: "0" }}>
            the processing of personal data
          </span>
        </Typography>
        <Divider
          sx={{
            borderColor: "#ccc",
            mt: "-25px",
            p: 2,
            marginTop: "-1",
            color: "#666",
          }}
        >
          or
        </Divider>
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
            textAlign: "center",
            cursor: "pointer",
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
            Login in to Google
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: "400",
            letterSpacing: "1px",
            m: "0, 16px",
            textAlign: "center",
            color: "#246dacff",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Other authorization methods
        </Typography>
      </Box>
    </Modal>
  );
};
