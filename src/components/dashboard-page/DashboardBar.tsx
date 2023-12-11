import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { DashboardContext } from "../../layouts/DashboardLayout";

const DashboardBar: React.FC = () => {
  const navigate = useNavigate();

  const {
    session: { is_admin },
  } = useContext(DashboardContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    Cookies.remove("current-session");
    navigate("/");
  };

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
              <Link
                underline="none"
                color={(theme) => theme.palette.secondary.main}
                component={RouteLink}
                to={""}
              >
                Media Belajar
              </Link>
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
                to={"pedoman"}
              >
                Pedoman
              </Link>
              <Link
                underline="none"
                color={(theme) => theme.palette.secondary.main}
                component={RouteLink}
                to={"silabus"}
              >
                Silabus
              </Link>
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
              {is_admin && (
                <Link
                  underline="none"
                  color={(theme) => theme.palette.secondary.main}
                  component={RouteLink}
                  to={"student-activities"}
                >
                  Aktivitas Siswa
                </Link>
              )}
              <Button
                variant="contained"
                size="small"
                sx={{ bgcolor: "white", color: "primary.main" }}
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing="1.25em"
              alignItems="center"
              fontWeight="bold"
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
              }}
            >
              <IconButton
                color="secondary"
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem sx={{ minHeight: 36 }} onClick={handleClose}>
                  <Link underline="none" component={RouteLink} to={"pedoman"}>
                    Pedoman
                  </Link>
                </MenuItem>
                <MenuItem sx={{ minHeight: 36 }} onClick={handleClose}>
                  <Link underline="none" component={RouteLink} to={"silabus"}>
                    Silabus
                  </Link>
                </MenuItem>
                <MenuItem sx={{ minHeight: 36 }} onClick={handleClose}>
                  <Link underline="none" component={RouteLink} to={"modules"}>
                    Modul
                  </Link>
                </MenuItem>
                <MenuItem sx={{ minHeight: 36 }} onClick={handleClose}>
                  <Link
                    underline="none"
                    component={RouteLink}
                    to={"assignments"}
                  >
                    Assignment
                  </Link>
                </MenuItem>
                {is_admin && (
                  <MenuItem sx={{ minHeight: 36 }} onClick={handleClose}>
                    <Link
                      underline="none"
                      component={RouteLink}
                      to={"student-activities"}
                    >
                      Aktivitas Siswa
                    </Link>
                  </MenuItem>
                )}
                <MenuItem sx={{ minHeight: 36, px: 1 }} disableGutters>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardBar;
