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
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
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
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Masuk
        </Button>
        <Grid container sx={{ mb: 1.5 }}>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Lupa Password
            </Link>
          </Grid>
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
