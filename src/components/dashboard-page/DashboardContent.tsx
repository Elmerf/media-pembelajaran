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
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../layouts/DashboardLayout";

const DashboardContent: React.FC = () => {
  const {
    session: { name, is_admin },
  } = useContext(DashboardContext);

  const greeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 3 && currentHour < 11) {
      return "Selamat Pagi";
    }

    if (currentHour >= 11 && currentHour < 15) {
      return "Selamat Siang";
    }

    if (currentHour >= 15 && currentHour < 20) {
      return "Selamat Petang";
    }

    return "Selamat Malam";
  };

  return (
    <Box px={4} py={2}>
      <Container disableGutters maxWidth="lg">
        <Typography variant="body1" component="h6" py={1.5}>
          {greeting()}, <strong>{name}</strong>
        </Typography>
        {/* <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold">
              Assignment
            </Typography>
            {is_admin ? (
              <IconButton size="small">
                <Add />
              </IconButton>
            ) : null}
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
            <Typography variant="h6" fontWeight="bold">
              Modul Tersedia
            </Typography>
            {is_admin ? (
              <IconButton size="small">
                <Add />
              </IconButton>
            ) : null}
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
