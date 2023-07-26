import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Box } from "@mui/material";
import DashboardBar from "../components/dashboard-page/DashboardBar";
import AppFooter from "../components/landing-page/AppFooter";
import UserType from "../types/user.types";

const INITIAL_SESSION_VALUE: UserType = {
  email: "",
  username: "",
  name: "",
  password: "",
  is_admin: false,
};

type DashboardContext = {
  session: UserType;
};

export const DashboardContext = createContext<DashboardContext>({
  session: INITIAL_SESSION_VALUE,
});

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<UserType>(INITIAL_SESSION_VALUE);

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

  return (
    <DashboardContext.Provider value={{ session: session }}>
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
