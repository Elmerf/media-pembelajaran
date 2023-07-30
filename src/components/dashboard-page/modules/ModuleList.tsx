import { Add, ReportProblem } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
// import ModuleCard from "./ModuleCard";

const ModuleList: React.FC = () => {
  return (
    <Box px={4}>
      <Container disableGutters maxWidth="lg">
        {/* <Typography variant="body1" component="h6" py={1.5}>
          Selamat Pagi, <strong>Admin</strong>
        </Typography> */}
        {/* <Box>
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
          <Grid
            container
            py={1}
            direction={{ xs: "column", md: "row" }}
            rowSpacing={2}
            columnSpacing={{ xs: 0, md: 2 }}
          >
            {new Array(5).fill(0).map(() => {
              return (
                <Grid item xs={12} md={3}>
                  <AssignmentCard />
                </Grid>
              );
            })}
          </Grid>
        </Box> */}
        <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold" pt={1}>
              Daftar Semua Modul
            </Typography>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Stack>
          {/* <Grid
            container
            py={1}
            direction={{ xs: "column", md: "row" }}
            rowSpacing={2}
            columnSpacing={{ xs: 0, md: 2 }}
          >
            {new Array(5).fill(0).map(() => {
              return (
                <Grid item xs={12} md={3}>
                  <ModuleCard />
                </Grid>
              );
            })}
          </Grid> */}
          {/* EMPTY STATE */}
          <Stack justifyContent="center" alignItems="center" py={4}>
            <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
            <Typography textAlign="center" variant="body1">
              Tidak ada Modul
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ModuleList;