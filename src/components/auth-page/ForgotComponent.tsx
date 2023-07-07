import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { QuestionMark } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const ForgotComponent: React.FC = () => {
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
        <QuestionMark />
      </Avatar>
      <Typography component="h1" variant="h5">
        Lupa Password
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

        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Kirim Konfirmasi Password
        </Button>
        <Grid container sx={{ mb: 1.5 }} justifyContent="end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              Kembali ke login
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ForgotComponent;
