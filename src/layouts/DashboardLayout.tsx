import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardBar from "../components/dashboard-page/DashboardBar";
import AppFooter from "../components/landing-page/AppFooter";
import UserType from "../types/user.types";
import useUserLogger from "../hooks/useUserLogger";

const INITIAL_SESSION_VALUE: UserType = {
  _id: "",
  email: "",
  username: "",
  name: "",
  password: "",
  is_admin: false,
};

type DashboardContext = {
  session: UserType;
  showLoader: (val: boolean) => void;
  setLoaderMsg: (val: string) => void;
};

export const DashboardContext = createContext<DashboardContext>({
  session: INITIAL_SESSION_VALUE,
  showLoader: () => {
    // PLACEHOLDER FUNCTION
  },
  setLoaderMsg: () => {
    // PLACEHOLDER FUNCTION
  },
});

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logUser } = useUserLogger();

  const [session, setSession] = useState<UserType>(INITIAL_SESSION_VALUE);

  const [showLoader, setShowLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("Hello");

  useEffect(() => {
    if (Cookies.get("current-session")) {
      const session: UserType = JSON.parse(
        Cookies.get("current-session") ?? "{}"
      );
      setSession(session);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (showLoader) {
      if (body) body.style.overflow = "hidden";
    } else {
      if (body) body.style.overflow = "auto";
    }
  }, [showLoader]);

  useEffect(() => {
    // deleteUnusedAssets();
  }, []);

  useEffect(() => {
    if (
      !location.pathname.includes("module") &&
      !location.pathname.includes("assignment")
    ) {
      logUser({ taskType: "endTask" });
    }
  }, [location, logUser]);

  return (
    <DashboardContext.Provider
      value={{
        session: session,
        showLoader: (val) => setShowLoader(val),
        setLoaderMsg,
      }}
    >
      {showLoader ? (
        <Box
          width={"100vw"}
          height={"100vh"}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={9999}
          sx={{
            bgcolor: (theme) => theme.palette.grey[100],
            opacity: 0.5,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 256,
              height: 64,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Stack spacing={2} alignItems={"center"}>
              <CircularProgress size={64} />
              <Stack>
                <Typography variant="body1" fontWeight={700}>
                  Mohon Tunggu...
                </Typography>
                <Typography variant="caption" fontWeight={500}>
                  {loaderMsg}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      ) : null}
      <Box
        minHeight="100vh"
        sx={{
          background: (theme) => theme.palette.grey[100],
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DashboardBar />
        <Box sx={{ flex: "1" }}>
          <Outlet />
        </Box>
        <AppFooter />
      </Box>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
