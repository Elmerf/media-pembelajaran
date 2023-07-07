import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";

import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/700.css";

// import "@fontsource/pt-sans/300.css";
import "@fontsource/pt-sans/400.css";
// import "@fontsource/pt-sans/500.css";
import "@fontsource/pt-sans/700.css";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardContent from "./components/dashboard-page/DashboardContent";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ba7445",
    },
    secondary: {
      main: "#f4f2e1",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    allVariants: {
      fontFamily: "nunito",
    },
    body1: {
      fontFamily: "PT Sans",
    },
    body2: {
      fontFamily: "PT Sans",
    },
    caption: {
      fontFamily: "PT Sans",
    },
    overline: {
      fontFamily: "PT Sans",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
  },
  {
    path: "login",
    element: <AuthLayout />,
  },
  {
    path: "forgot-password",
    element: <AuthLayout />,
  },
  {
    path: "register",
    element: <AuthLayout />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        path: "",
        element: <DashboardContent />,
      },
      {
        path: "modules",
        element: <DashboardContent />,
      },
      {
        path: "assignments",
        element: <DashboardContent />,
      },
      {
        path: "silabus",
        element: <DashboardContent />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
