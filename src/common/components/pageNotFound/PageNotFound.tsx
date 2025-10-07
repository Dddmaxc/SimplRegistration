import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const PageNotFound = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "start",
      height: "100vh",
      p: 10,
    }}
  >
    <Typography
      component="h2"
      sx={{ textAlign: "center", fontSize: "200px"}}
    >
      404
    </Typography>
    <Typography
      component="h2"
      sx={{
        textAlign: "center",
        fontSize: "50px",
        textTransform: "uppercase",
      }}
    >
      page not found
    </Typography>

    <Button component={RouterLink} to="/" variant="contained">
      Return on main
    </Button>
  </Box>
);
