import {
  Box,
  Button,
  Container,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { client } from "../../../lib/sanity-client";

const StudentActivitiesPage: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const students = await client.fetch(
          `*[_type == "user"  && is_admin == false]  | order(name asc)`
        );

        setStudents(students);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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
              Daftar Semua Siswa
            </Typography>
          </Stack>
        </Box>
        <TableContainer sx={{ pb: 2 }}>
          <Table>
            <TableHead>
              <TableCell>Nama Siswa</TableCell>
              <TableCell width={"25%"}>Aksi</TableCell>
            </TableHead>
            <TableBody>
              {isLoading && students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedStudent(student);
                      }}
                    >
                      Lihat Aktivitas
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog
        fullWidth
        maxWidth="md"
        open={selectedStudent}
        onClose={() => {
          setSelectedStudent(undefined);
        }}
      >
        {selectedStudent && (
          <Box p={4}>
            <Typography variant="h6">{selectedStudent.name}</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableCell>Waktu</TableCell>
                  <TableCell>Log Aktivitas</TableCell>
                </TableHead>
                <TableBody>
                  {!selectedStudent.log_activities ||
                  selectedStudent.log_activities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Tidak ada aktivitas
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedStudent.log_activities.map(
                      (log: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {dayjs(log.date).format("YYYY/MM/DD HH:mm:ss")}
                          </TableCell>
                          <TableCell>{log.activity}</TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default StudentActivitiesPage;
