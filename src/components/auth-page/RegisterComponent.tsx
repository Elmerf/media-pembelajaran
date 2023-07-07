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
import { Link as RouterLink } from "react-router-dom";

const RegisterComponent: React.FC = () => {
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirm-password"
          label="Confirm Password"
          type="password"
          id="confirm-password"
        />
        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
