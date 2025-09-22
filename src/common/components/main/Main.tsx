import { Box, Button } from "@mui/material";
import backgroundImage from "../../../assets/images/barcai.webp";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const navigate = useNavigate(); // хук для перехода

  const handleGoToShopping = () => {
    navigate("/Shop"); // путь, на который нужно перейти
  };

  return (
    <Box
      sx={{
        height: "87vh",
        width: "100%",
        background: `
      linear-gradient(180deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.34) 20%, 
        rgba(7, 7, 28, 0.11) 70%, 
        rgba(12, 10, 59, 1) 100%
      ),
      url(${backgroundImage})
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        borderRadius: "10px",
      }}
    >
      <Button
        onClick={handleGoToShopping}
        color={"success"}
        variant="contained"
        endIcon={<SendIcon />}
      >
        go to shopping
      </Button>
    </Box>
  );
};
