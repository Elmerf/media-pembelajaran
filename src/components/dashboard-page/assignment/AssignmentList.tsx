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
import { useNavigate } from "react-router-dom";
import { client } from "../../../lib/sanity-client";
import AssignmentCard from "./AssignmentCard";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import AssignmentFormModal from "./AssignmentFormModal";

const AssignmentList: React.FC = () => {
  const navigate = useNavigate();

  const {
    session: { is_admin },
  } = useContext(DashboardContext);
  const [isLoading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any[]>([]);
  const [openAssignment, setOpenAssignment] = useState(false);

  const handleAddAssignment = () => {
    setOpenAssignment(true);
  };

  useEffect(() => {
    const fetchAsync = async () => {
      setLoading(true);
      const dataAssignment = await client.fetch(
        "*[_type == 'assignment'] | order(_updatedAt desc)"
      );

      setAssignment(dataAssignment);
      setLoading(false);
    };

    fetchAsync();

    const assignmentSub = client
      .listen("*[_type == 'assignment'] | order(_updatedAt desc)")
      .subscribe((Update) => {
        const newData: any = Update.result;
        setAssignment((assignments) => [...assignments, newData]);
      });

    return () => {
      assignmentSub.unsubscribe();
    };
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
              Daftar Semua Assignment
            </Typography>
            {is_admin ? (
              <IconButton size="small" onClick={() => handleAddAssignment()}>
                <Add />
              </IconButton>
            ) : null}
          </Stack>
          {/* EMPTY STATE */}
          {assignment.length > 0 && !isLoading ? (
            <Grid
              container
              py={1}
              direction={{ xs: "column", md: "row" }}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 2 }}
            >
              {assignment.map((assignment: any) => {
                return assignment?._id ? (
                  <Grid item xs={12} md={3} key={assignment._id}>
                    <AssignmentCard
                      id={assignment._id}
                      title={assignment.title}
                      description={assignment.description}
                      coverImage={assignment.coverImage?.asset?._ref}
                      deadline={assignment.deadline}
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
                Tidak ada Assignment
              </Typography>
            </Stack>
          )}
        </Box>
      </Container>
      <AssignmentFormModal
        open={openAssignment}
        onClose={() => {
          setOpenAssignment(false);
        }}
      />
    </Box>
  );
};

export default AssignmentList;
