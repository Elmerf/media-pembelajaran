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
import { useContext, useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import { useNavigate } from "react-router-dom";
import { client } from "../../../lib/sanity-client";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import ModuleFormModal from "./ModuleFormModal";

const ModuleList: React.FC = () => {
  const navigate = useNavigate();
  const {
    session: { is_admin },
  } = useContext(DashboardContext);

  const [openModule, setOpenModule] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);

  const handleAddModule = () => {
    setOpenModule(true);
  };

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

    // const subModules = client
    //   .listen("*[_type == 'module'] | order(_updatedAt)")
    //   .subscribe((Update) => {
    //     const newData: any = Update.result;
    //     setModules((modules) => [...modules, newData]);
    //   });

    // return () => {
    //   subModules.unsubscribe();
    // };
  }, []);

  return (
    <Box px={4}>
      <Container disableGutters maxWidth="lg">
        <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold" pt={1}>
              Daftar Semua Modul
            </Typography>
            {is_admin ? (
              <IconButton size="small" onClick={() => handleAddModule()}>
                <Add />
              </IconButton>
            ) : null}
          </Stack>
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
      <ModuleFormModal
        open={openModule}
        onClose={() => {
          setOpenModule(false);
        }}
      />
    </Box>
  );
};

export default ModuleList;
