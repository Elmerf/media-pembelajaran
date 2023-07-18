import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme } from "@mui/material";
import heroImg from "../../assets/hero-main.jpg";

const AppHero: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "80vh",
      }}
    >
      <img
        src={heroImg}
        alt="hero-image"
        style={{
          zIndex: -1,
          position: "absolute",
          inset: 0,
          height: "100%",
          width: "100%",
          objectFit: "cover",
          filter: "brightness(50%)",
        }}
      />
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          color: theme.palette.primary.contrastText,
          width: "100%",
        })}
        px="1.5em"
        textAlign="center"
      >
        <Typography
          variant={"h1"}
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 15%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            [theme.breakpoints.down("md")]: {
              fontSize: "2.25em",
            },
          }}
        >
          Media Pembelajaran
        </Typography>
        <Typography
          variant="h3"
          sx={{
            [theme.breakpoints.down("md")]: {
              fontSize: "1.5em",
            },
          }}
        >
          Teknik Pengelolahan Audio Video
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{
            width: "10em",
            mt: 1.5,
            textTransform: "capitalize",
            alignSelf: "center",
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Mulai Belajar
        </Button>
      </Box>
    </Box>
  );
};

export default AppHero;
