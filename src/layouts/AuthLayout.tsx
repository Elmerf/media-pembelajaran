import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import LoginComponent from "../components/auth-page/LoginComponent";
import ForgotComponent from "../components/auth-page/ForgotComponent";
import RegisterComponent from "../components/auth-page/RegisterComponent";
import bgImage from "../assets/hero-main.jpg";

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const currentPathName = location.pathname;

  let component;
  if (currentPathName === "/login") {
    component = <LoginComponent />;
  } else if (currentPathName === "/forgot-password") {
    component = <ForgotComponent />;
  } else if (currentPathName === "/register") {
    component = <RegisterComponent />;
  }

  return (
    <Container disableGutters component="main" maxWidth="xs">
      <img
        alt="auth-bg-image"
        src={bgImage}
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          filter: "brightness(30%)",
          zIndex: -1,
        }}
      />
      {component}
    </Container>
  );
};

export default AuthLayout;
