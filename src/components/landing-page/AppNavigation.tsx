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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHero from "./AppHero";

const AppNavigation: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ height: "80vh" }}>
      <AppBar
        position="sticky"
        color="transparent"
        sx={(theme) => ({
          backdropFilter: "blur(0.3em) brightness(150%)",
          color: theme.palette.primary.contrastText,
        })}
      >
        {/* <Container
          maxWidth="sm"
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >
          <Toolbar disableGutters>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                  xs: {
                    display: "block",
                  },
                  sm: {
                    display: "none",
                  },
                }}
              >
                <Box sx={{ paddingInline: "1em" }}>
                  <Toolbar />
                  <List
                    disablePadding
                    sx={{
                      minWidth: "60vw",
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "1em",
                      fontWeight: "bold",
                    }}
                  >
                    <ListItem disableGutters disablePadding>
                      <Link
                        fontSize={"1.25em"}
                        underline="none"
                        href="#home"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Home
                      </Link>
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <Link
                        fontSize={"1.25em"}
                        underline="none"
                        href="#tentang"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Tentang
                      </Link>
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <Button
                        variant="contained"
                        sx={{ width: "100%" }}
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </Button>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
              <IconButton
                aria-label="menu-for-mobile"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuOutlined
                  sx={(theme) => ({
                    color: theme.palette.primary.contrastText,
                  })}
                />
              </IconButton>
              <Typography
                variant="h5"
                sx={(theme) => ({
                  fontWeight: "bold",
                  flexShrink: 0,
                  flexGrow: 1,
                  justifySelf: "center",
                  alignSelf: "center",
                  textAlign: "center",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 15%, ${theme.palette.secondary.main} 90%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                })}
              >
                Selamat Datang
              </Typography>
            </Box>
          </Toolbar>
        </Container> */}
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
                  justifySelf: "center",
                  alignSelf: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                  background: theme.palette.secondary.main,
                  // background: `linear-gradient(135deg, ${theme.palette.primary.main} 15%, ${theme.palette.secondary.main} 90%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                })}
              >
                Selamat Datang
              </Typography>
              <Stack
                direction="row"
                spacing="1.25em"
                alignItems="center"
                fontWeight="bold"
              >
                <Link href="#pedoman">
                  <Typography color={"white"}>Pedoman</Typography>
                </Link>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Stack>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <AppHero />
    </Box>
  );
};

export default AppNavigation;
