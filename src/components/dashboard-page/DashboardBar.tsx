import { useLocation, useNavigate, Link as RouteLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const DashboardBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      sx={(theme) => ({
        color: theme.palette.primary.contrastText,
      })}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense">
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={(theme) => ({
                flexShrink: 0,
                flexGrow: 1,
                fontWeight: "bold",
                background: theme.palette.secondary.main,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              })}
            >
              Media Belajar
            </Typography>
            <Stack
              direction="row"
              spacing="1.25em"
              alignItems="center"
              fontWeight="bold"
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <Link
                underline="none"
                color={(theme) => theme.palette.secondary.main}
                component={RouteLink}
                to={"modules"}
              >
                Modul
              </Link>
              <Link
                underline="none"
                color={(theme) => theme.palette.secondary.main}
                component={RouteLink}
                to={"assignments"}
              >
                Assignment
              </Link>
              <Link
                underline="none"
                color={(theme) => theme.palette.secondary.main}
                component={RouteLink}
                to={"silabus"}
              >
                Silabus
              </Link>
              <Button
                variant="contained"
                size="small"
                sx={{ bgcolor: "white", color: "primary.main" }}
                onClick={() => navigate("/")}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardBar;
