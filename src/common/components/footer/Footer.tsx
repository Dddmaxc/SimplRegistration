import * as React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";;
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";

// Используем только стандартные цвета MUI
type ColorPaletteProp =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

export const Footer = () => {
  const [color, _setColor] = React.useState<ColorPaletteProp>("primary");
  const [solid, setSolid] = React.useState(true);
  const theme = useTheme();

  // Безопасное получение цвета из палитры
  const getColorShade = (shadeKey: keyof any): string => {
    const paletteColor = theme.palette[color] as any;
    if (paletteColor && paletteColor[shadeKey]) {
      return paletteColor[shadeKey];
    }
    // Fallback цвета
    return shadeKey === 50
      ? "#ffffffff"
      : shadeKey === 100
      ? "#000000ff"
      : shadeKey === 200
      ? "#00fcbd89"
      : shadeKey === 300
      ? "#d1d2e9ff"
      : shadeKey === 400
      ? "#fdb830"
      : shadeKey === 500
      ? "#9e9e9e"
      : shadeKey === 600
      ? "#9b0041"
      : shadeKey === 700
      ? "#220e0eff"
      : shadeKey === 800
      ? "#181733"
      : "#ffeaeaff";
  };

  const color1 = solid ? getColorShade(800) : getColorShade(600);
  const color2 = solid ? getColorShade(600) : getColorShade(800);
  const color3 = getColorShade(900);
  const gradient1 = `${color1}, ${color2} 65%`;
  const gradient2 = `${color1} 65%, ${color3}`;
  const textColor = { color: solid ? getColorShade(50) : getColorShade(400) };

  const buttonStyles = {
    borderRadius: "99px",
    "&:hover": {
      "& .MuiButton-endIcon": { transform: "translate(4px, 0px)" },
    },
    "& span": { transition: "0.15s" },
  };

  return (
    <Paper
      elevation={solid ? 3 : 1}
      sx={[
        {
          flexGrow: 1,
          position: "relative",
          display: "flex",
          p: "6rem 3rem",
          borderRadius: "12px",
          overflow: "hidden",
          "&::after": {
            content: '""',
            display: "block",
            width: "20rem",
            height: "40rem",
            background: `linear-gradient(to top, ${gradient1}, ${gradient2})`,
            position: "absolute",
            transform: "rotate(-45deg)",
            top: { xs: "-80%", sm: "-95%", md: "-65%", lg: "-70%" },
            right: { xs: "-70%", sm: "-15%" },
          },
        },
        solid
          ? { bgcolor: getColorShade(800) }
          : { bgcolor: getColorShade(600) },
      ]}
    >
      <div>
        <Typography variant="h1" component="h2" sx={textColor}>
          Shop Barca
        </Typography>
        <Typography sx={{ mt: 1, mb: 2, ...textColor }}>
          Instant access to the power of the Joy UI library.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            variant={solid ? "contained" : "outlined"}
            endIcon={<ArrowForwardIcon fontSize="medium" />}
            sx={[
              {...textColor, ...buttonStyles },  
              solid
                ? { "&:active": { bgcolor: getColorShade(200) } }
                : { "&:active": { bgcolor: getColorShade(700) } },
            ]}
          >
            Install
          </Button>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon fontSize="medium" />}
            sx={{ ...textColor, ...buttonStyles }}
          >
            See the docs
          </Button>
        </Box>
      </div>
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          bgcolor: "transparent",
          display: "flex",
          gap: 2,
          "& button": { borderRadius: "50%" },
        }}
      >
        <IconButton
          onClick={() => setSolid((state) => !state)}
          sx={{
            bgcolor: solid ? getColorShade(600) : getColorShade(400),
            color: solid ? getColorShade(50) : getColorShade(800),
          }}
        >
          <InvertColorsIcon fontSize="large" />
        </IconButton>
      </Box>
    </Paper>
  );
}
