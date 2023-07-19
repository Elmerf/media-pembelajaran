import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import assignmentImg from "../../../assets/assignment-image.jpg";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const AssignmentCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ boxShadow: 2 }}>
      <CardMedia component="img" image={assignmentImg} height={"172em"} />
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
        <Stack
          alignItems="flex-end"
          justifyContent="space-between"
          direction={{ xs: "column", md: "row" }}
          spacing={1}
        >
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="secondary"
            // onClick={() =>
            //   navigate(`module/${Math.floor(100000 + Math.random() * 900000)}`)
            // }
          >
            <Link
              component={RouterLink}
              to={`/dashboard/assignment/${Math.floor(
                100000 + Math.random() * 900000
              )}`}
              variant="body2"
            >
              Lihat Detail
            </Link>
          </Button>
          <Button fullWidth variant="contained" size="small">
            Nilai
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
