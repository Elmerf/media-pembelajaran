import { Add } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AssignmentCard from "./assignment/AssignmentCard";
import ModuleCard from "./modules/ModuleCard";

const DashboardContent: React.FC = () => {
  return (
    <Box px={4}>
      <Container disableGutters maxWidth="lg">
        <Typography variant="body1" component="h6" py={1.5}>
          Selamat Pagi, <strong>Admin</strong>
        </Typography>
        <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold">
              Assignment
            </Typography>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Stack>
          <Grid container py={1} spacing={2}>
            {new Array(5).fill(0).map(() => {
              return (
                <Grid item>
                  <AssignmentCard />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold">
              Modul Tersedia
            </Typography>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Stack>
          <Grid container py={1} spacing={2}>
            {new Array(5).fill(0).map(() => {
              return (
                <Grid item>
                  <ModuleCard />
                </Grid>
              );
            })}
          </Grid>
          {/* EMPTY STATE */}
          {/* <Stack justifyContent="center" alignItems="center" py={4}>
          <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
          <Typography textAlign="center" variant="body1">
            Tidak ada Modul
          </Typography>
        </Stack> */}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardContent;
