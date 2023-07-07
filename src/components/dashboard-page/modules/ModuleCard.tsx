import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import moduleImage from "../../../assets/module-image.jpg";

const ModuleCard: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ minWidth: "18em" }}>
      <CardMedia component="img" image={moduleImage} height={140} />
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
            Lihat Detail
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
