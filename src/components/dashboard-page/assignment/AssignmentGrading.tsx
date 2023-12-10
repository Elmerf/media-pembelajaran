import { ReportProblem } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import handleSource from "../../../helpers/source-handler";

import { client } from "../../../lib/sanity-client";

type AssignmentGrading = {
  grades?: any[];
  documentId: string;
  open: boolean;
  onClose: () => void;
};

const AssignmentGrading: React.FC<AssignmentGrading> = (props) => {
  const handleUpdateNilai = async (
    e: React.FocusEvent<HTMLInputElement>,
    key: string
  ) => {
    const data = await client
      .patch(props.documentId)
      .set({ [`grades[_key == "${key}"].grade`]: e.target.value })
      .commit();

    // console.log(data);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth={"md"}
      fullWidth
      scroll="paper"
    >
      <Box p={4}>
        <Typography variant="h6">Nilai Tugas</Typography>
        {props.grades && props.grades.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Siswa</TableCell>
                  <TableCell>Tanggal Pengumpulan</TableCell>
                  <TableCell>Aksi</TableCell>
                  <TableCell>Nilai</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.grades?.map((grade, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{grade?.student?.name}</TableCell>
                      <TableCell>
                        {new Date(
                          grade?.studentfile[0]?.asset?._updatedAt
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          {grade?.studentfile?.map(
                            (file: any, index: number) => {
                              return (
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    window.open(
                                      handleSource(
                                        file.asset?.extension,
                                        file.asset?.url
                                      )
                                    );
                                  }}
                                  key={index}
                                >
                                  Lihat Jawaban {index + 1}
                                </Button>
                              );
                            }
                          )}
                          {/* <Button
                            variant="contained"
                            onClick={() => {
                              setSelectedRow(index);
                              nilaiInputRef.current?.click();
                            }}
                          >
                            Nilai
                          </Button> */}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={grade?.grade}
                          size="small"
                          sx={{
                            maxWidth: 64,
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                              {
                                display: "none",
                              },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            handleUpdateNilai(e, grade._key)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack justifyContent="center" alignItems="center" py={4}>
            <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
            <Typography textAlign="center" variant="body1">
              Tidak ada siswa yang mengumpulkan
            </Typography>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

export default AssignmentGrading;
