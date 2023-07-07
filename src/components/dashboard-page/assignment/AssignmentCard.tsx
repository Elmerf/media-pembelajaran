import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import assignmentImg from "../../../assets/assignment-image.jpg";

const AssignmentCard: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ minWidth: "18em" }}>
      <CardMedia component="img" image={assignmentImg} height={140} />
      <CardContent>
        <Typography variant="body1" fontWeight="bold" pb={2}>
          Judul Tugas
        </Typography>
        <Typography variant="body2" pb={2}>
          Deskripsi Tugas
        </Typography>
        <Typography variant="body2">Siswa mengumpulkan: 4/30</Typography>
        <Typography variant="body2">Siswa dinilai: 1/30</Typography>
        <Typography variant="body2" pb={2}>
          Deadline: {new Date().toLocaleString("id")}
        </Typography>
        <Stack justifyContent="space-between" direction="row">
          <Button
            variant="contained"
            size="small"
            sx={{ width: "48%" }}
            color="secondary"
          >
            Lihat Detail
          </Button>
          <Button variant="contained" size="small" sx={{ width: "48%" }}>
            Nilai
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
