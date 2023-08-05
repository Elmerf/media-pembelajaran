import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { compare } from "bcrypt-ts/browser";
import Cookies from "js-cookie";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { client } from "../../lib/sanity-client";
import type UserType from "../../types/user.types";

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      alert("Silahkan isi email dan password terlebih dahulu");
      return;
    }

    const data = await client.fetch<UserType[]>(
      "*[_type == 'user' && email == $email]{ _id, email, password, name, username, is_admin }",
      { email: email }
    );

    if (data.length === 0) {
      resetFields();
      alert("Email atau Password salah, Silahkan coba kembali");
      return;
    }

    const isSame = await compare(password, data[0].password);

    if (!isSame) {
      resetFields();
      alert("Email atau Password salah, Silahkan coba kembali");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...savedValue } = data[0];
    Cookies.set("current-session", JSON.stringify(savedValue));
    navigate("/dashboard");
  };

  useEffect(() => {
    if (Cookies.get("current-session")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <Box
      boxShadow={4}
      sx={{
        borderRadius: 3,
        marginTop: 16,
        paddingInline: 2,
        marginInline: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "white",
        opacity: "0.9",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Masuk Dashboard
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => handleLogin()}
        >
          Masuk
        </Button>
        <Grid container sx={{ mb: 1.5 }} justifyContent={"space-between"}>
          {/* <Grid item>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Lupa Password
            </Link>
          </Grid> */}
          <Grid item>
            <Link component={RouterLink} to="/register" variant="body2">
              Belum punya akun? silahkan daftar
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginComponent;
