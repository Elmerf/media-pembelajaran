import { useContext, useEffect, useState } from "react";
import {
  Add,
  ArrowRight,
  ArrowRightAlt,
  ReportProblem,
  Update,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { DashboardContext } from "../../layouts/DashboardLayout";
import { client } from "../../lib/sanity-client";
import SkeletonCard from "./commons/SkeletonCard";
import ModuleCard from "./modules/ModuleCard";
import AssignmentCard from "./assignment/AssignmentCard";
import ModuleFormModal from "./modules/ModuleFormModal";
import { useNavigate } from "react-router-dom";

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  const [openModule, setOpenModule] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState([]);

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

  useEffect(() => {
    const fetchAsync = async () => {
      setLoading(true);
      const dataModule = await client.fetch(
        "*[_type == 'module'] | order(_updatedAt desc) [0...4]"
      );
      const dataAssignment = await client.fetch(
        "*[_type == 'assignment'] | order(_updatedAt desc) [0...4]"
      );

      setModules(dataModule);
      setAssignments(dataAssignment);
      setLoading(false);
    };

    fetchAsync();

    const subModules = client
      .listen("*[_type == 'module'] | order(_updatedAt) [0...4]")
      .subscribe((Update) => {
        const newData = Update.result;
        setModules((modules: any[]) => {
          const updatedModules = [...modules];
          updatedModules.unshift(newData);
          updatedModules.pop();
          return updatedModules;
        });
      });

    return () => {
      subModules.unsubscribe();
    };
  }, []);

  const handleAddModule = () => {
    setOpenModule(true);
  };

  return (
    <Box px={4} py={2}>
      <Container disableGutters maxWidth="lg">
        <Typography variant="body1" component="h6" py={1.5}>
          {greeting()}, <strong>{name}</strong>
        </Typography>
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
              <IconButton size="small" onClick={() => handleAddModule()}>
                <Add />
              </IconButton>
            ) : null}
          </Stack>
          {modules.length > 0 && !isLoading ? (
            <Grid
              container
              py={1}
              direction={{ xs: "column", md: "row" }}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 2 }}
            >
              {modules.map((module: any) => {
                return module?._id ? (
                  <Grid item xs={12} md={3} key={module._id}>
                    <ModuleCard
                      id={module._id}
                      title={module.title}
                      description={module.description}
                      coverImage={module.coverImage?.asset?._ref}
                    />
                  </Grid>
                ) : null;
              })}
              <Grid item xs={12}>
                <Grid container justifyContent={"center"}>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowRight fontSize="large" />}
                      onClick={() => navigate("/dashboard/modules")}
                    >
                      Modul Lainnya
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : isLoading ? (
            <Grid
              container
              py={1}
              direction={{ xs: "column", md: "row" }}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 2 }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <SkeletonCard />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada Modul
              </Typography>
            </Stack>
          )}
        </Box>
        <Box mt={2}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold">
              Assignment
            </Typography>
            {/* {is_admin ? (
              <IconButton size="small">
                <Add />
              </IconButton>
            ) : null} */}
          </Stack>
          {assignments.length > 0 && !isLoading ? (
            <Grid
              container
              py={1}
              direction={{ xs: "column", md: "row" }}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 2 }}
            >
              {assignments.map((assignment: any) => {
                return (
                  <Grid item xs={12} md={3} key={assignment._id}>
                    <AssignmentCard
                      id={assignment._id}
                      coverImage={assignment.coverImage?.asset?._ref}
                      title={assignment.title}
                      description={assignment.description}
                      deadline={assignment.deadline}
                    />
                  </Grid>
                );
              })}
              <Grid item xs={12}>
                <Grid container justifyContent={"center"}>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowRight fontSize="large" />}
                      onClick={() => navigate("/dashboard/assignments")}
                    >
                      Assignment Lainnya
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : isLoading ? (
            <Grid
              container
              py={1}
              direction={{ xs: "column", md: "row" }}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 2 }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <SkeletonCard />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada Assignment
              </Typography>
            </Stack>
          )}
        </Box>
      </Container>
      <ModuleFormModal
        open={openModule}
        onClose={() => {
          setOpenModule(false);
        }}
      />
    </Box>
  );
};

export default DashboardContent;
