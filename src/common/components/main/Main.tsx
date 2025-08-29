import { Button } from "@mui/material";
import style from "./main.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";


export const Main = () => {
  const navigate = useNavigate(); // хук для перехода

  const handleGoToShopping = () => {
    navigate("/Shop"); // путь, на который нужно перейти
  };

  return (
    <div className={style.mainContainer}>
      <Button
        onClick={handleGoToShopping}
        sx={{ height: 30, marginTop: 15 }}
        color={"success"}
        variant="contained"
        endIcon={<SendIcon />}
      >
        go to shopping
      </Button>
    </div>
  );
};
