import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import tentangIlustration from "../../assets/tentang-ilustration.jpg";
import { Circle } from "@mui/icons-material";

const AppContent: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" disableGutters>
      {/* <Box textAlign="center" p="2em" id="home">
        <Typography variant="h4" fontWeight="bold" mb="0.5em">
          Home
        </Typography>
        <Typography textAlign="left">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
          debitis velit. Laudantium, quo sed vitae explicabo neque dolorum,
          aperiam error possimus excepturi, nostrum a iste distinctio officia
          repudiandae minima saepe?
        </Typography>
        <Divider sx={{ marginBlock: "0.5em" }} />
        <Typography textAlign="right">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
          debitis velit. Laudantium, quo sed vitae explicabo neque dolorum,
          aperiam error possimus excepturi, nostrum a iste distinctio officia
          repudiandae minima saepe?
        </Typography>
      </Box> */}
      <Box id="tentang" p="2em">
        <Stack
          direction={"column"}
          spacing={2}
          sx={{
            [theme.breakpoints.up("md")]: {
              flexDirection: "row",
            },
          }}
        >
          <img
            src={tentangIlustration}
            alt="Illustration"
            style={{ width: "50em", maxWidth: "80vw", objectFit: "contain" }}
          />
          <Stack spacing={2}>
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              mb="0.5em"
            >
              Tentang
            </Typography>
            <Typography textAlign="center" variant="body1">
              Media pembelajaran teknik pengolahan audio video ini merupakan web
              yang digunakan untuk guru dan siswa sebagai bahan dalam proses
              pembelajaran, dengan di buatnya web ini diharapkan dapat
              mempermudah guru dan siswa dalam mengakses materi dan tugas
            </Typography>
            <Divider role="presentation">
              <Circle fontSize="inherit" color="primary" />
            </Divider>
          </Stack>
        </Stack>
        {/* <Typography textAlign="left">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae,
          debitis velit. Laudantium, quo sed vitae explicabo neque dolorum,
          aperiam error possimus excepturi, nostrum a iste distinctio officia
          repudiandae minima saepe?
        </Typography>
        <Divider
          sx={(theme) => ({
            marginBlock: "0.5em",
            borderColor: theme.palette.primary.contrastText,
          })}
        /> */}
      </Box>
    </Container>
  );
};

export default AppContent;
