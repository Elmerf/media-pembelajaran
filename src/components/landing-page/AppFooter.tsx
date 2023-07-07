import { Copyright } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const AppFooter: React.FC = () => {
  return (
    <Box
      textAlign="center"
      py="0.65em"
      sx={(theme) => ({
        background: theme.palette.secondary.main,
      })}
    >
      <Typography
        variant="caption"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="2px"
      >
        Copyright <Copyright fontSize="inherit" /> {new Date().getFullYear()},
        @username
      </Typography>
    </Box>
  );
};

export default AppFooter;
