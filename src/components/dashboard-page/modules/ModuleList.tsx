import { Add, ArrowRight, ReportProblem } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SkeletonCard from "../commons/SkeletonCard";
import { useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import { useNavigate } from "react-router-dom";
import { client } from "../../../lib/sanity-client";
// import ModuleCard from "./ModuleCard";

const ModuleList: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const fetchAsync = async () => {
      setLoading(true);
      const dataModule = await client.fetch(
        "*[_type == 'module'] | order(_updatedAt desc)"
      );

      setModules(dataModule);
      setLoading(false);
    };

    fetchAsync();
  }, []);

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
              {/* <Grid item xs={12}>
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
              </Grid> */}
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
      </Container>
    </Box>
  );
};

export default ModuleList;
