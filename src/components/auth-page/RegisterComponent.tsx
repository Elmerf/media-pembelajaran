import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, PermContactCalendar } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { hashSync } from "bcrypt-ts/browser";
import { client } from "../../lib/sanity-client";

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasword, setconfirmPasword] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPasword) return alert("Password tidak sama");

    try {
      const data = {
        _type: "user",
        name: name,
        username: email,
        email: email,
        password: hashSync(password),
        is_admin: false,
      };

      await client.create(data);
      alert("Akun berhasil dibuat");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
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
        <PermContactCalendar />
      </Avatar>
      <Typography component="h1" variant="h5">
        Daftar Akun
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          type="email"
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirm-password"
          label="Confirm Password"
          type="password"
          id="confirm-password"
          onChange={(e) => setconfirmPasword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Daftar
        </Button>
        <Grid container sx={{ mb: 1.5 }} justifyContent="end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Sudah punya akun? silahkan masuk
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegisterComponent;
