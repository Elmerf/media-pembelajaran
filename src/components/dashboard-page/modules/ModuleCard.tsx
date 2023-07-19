import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import moduleImage from "../../../assets/module-image.jpg";

const ModuleCard: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 2 }}>
      <CardMedia component="img" image={moduleImage} height={"172em"} />
      <CardContent>
        <Typography variant="body1" fontWeight="bold" pb={2}>
          Judul Modul
        </Typography>
        <Typography variant="body2" pb={2}>
          Deskripsi Modul
        </Typography>
        {/* <Typography variant="body2">Siswa mengumpulkan: 4/30</Typography>
        <Typography variant="body2">Siswa dinilai: 1/30</Typography>
        <Typography variant="body2" pb={2}>
          Deadline: {new Date().toLocaleString("id")}
        </Typography> */}
        <Stack justifyContent="end" direction="row">
          <Button
            variant="contained"
            size="small"
            sx={{ width: "48%" }}
            color="secondary"
          >
            <Link
              component={RouterLink}
              to={`/dashboard/module/${Math.floor(
                100000 + Math.random() * 900000
              )}`}
              variant="body2"
            >
              Lihat Detail
            </Link>
          </Button>
          {/* <Button variant="contained" size="small" sx={{ width: "48%" }}>
            Nilai
          </Button> */}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
