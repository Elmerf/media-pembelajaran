import { Box } from "@mui/material";
import DashboardBar from "../components/dashboard-page/DashboardBar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <Box
      minHeight="100vh"
      sx={{
        background: (theme) => theme.palette.grey[100],
      }}
    >
      <DashboardBar />
      <Outlet />
    </Box>
  );
};

export default DashboardLayout;
