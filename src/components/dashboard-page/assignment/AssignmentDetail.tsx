import {
  Circle,
  Delete,
  Download,
  Edit,
  ReportProblem,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import assignmentImage from "../../../assets/assignment-image.jpg";
import fileNameEllipsis from "../../../helpers/filename-ellipsis";
import formatBytes from "../../../helpers/format-bytes";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import { client } from "../../../lib/sanity-client";
import handleSource from "../../../helpers/source-handler";
import AssignmentFormModal from "./AssignmentFormModal";
import SwiperComponent from "../commons/SwiperComponent";
import AssignmentGrading from "./AssignmentGrading";
import useUserLogger from "../../../hooks/useUserLogger";

const AssignmentDetail: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    session: { is_admin, _id },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const { logUser } = useUserLogger();

  const downloadRef = useRef<HTMLAnchorElement>(null);
  const assignmentRef = useRef<HTMLInputElement>(null);

  const [detailData, setDetailData] = useState<any>();
  const [openForm, setOpenForm] = useState(false);
  const [openGrading, setOpenGrading] = useState(false);

  const [studentFileKey, setFileKey] = useState("");

  const handleSubmitAssignment: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.files) {
      if (e.target.files?.length > 2)
        return alert("Maksimal File yang diupload adalah 2 file");

      const data = e.target.files[0];

      showLoader(true);
      setLoaderMsg("Uploading Assignment...");

      if (data) {
        const documentRes = await client.assets.upload("file", data);

        if (studentFileKey) {
          const dataPatch = await client
            .patch(detailData._id)
            .unset([
              `grades[_key=="${detailData?.grades?._key}"].studentfile[_key=="${studentFileKey}"]`,
            ])
            .append(`grades[_key=="${detailData?.grades?._key}"].studentfile`, [
              {
                _type: "file",
                asset: { _type: "reference", _ref: documentRes._id },
              },
            ])
            .commit({ autoGenerateArrayKeys: true });
        } else {
          const dataPatch = await client
            .patch(detailData._id)
            .append(`grades[_key=="${detailData?.grades?._key}"].studentfile`, [
              {
                _type: "file",
                asset: { _type: "reference", _ref: documentRes._id },
              },
            ])
            .commit({ autoGenerateArrayKeys: true });

          console.log("PATCHED", dataPatch);
        }

        if (!detailData?.grades) {
          const dataPatch = await client
            .patch(detailData._id)
            .setIfMissing({ grades: [] })
            .append(`grades`, [
              {
                student: { _type: "reference", _ref: _id },
                studentfile: [
                  {
                    _type: "file",
                    asset: { _type: "reference", _ref: documentRes._id },
                  },
                ],
              },
            ])
            .commit({ autoGenerateArrayKeys: true });

          console.log("PATCHED", dataPatch);
        }
      }
      setFileKey("");
      showLoader(false);
      location.reload();
    }
  };

  const handleDelete = async () => {
    const id = params.id;

    if (confirm("Anda akan menghapus assignment, lanjutkan?")) {
      try {
        if (id) {
          await client.delete(id);
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteAnswer = async (fileKey: string) => {
    console.log("FILEKEY", fileKey);
    if (confirm("Anda akan menghapus jawaban, lanjutkan?")) {
      try {
        showLoader(true);
        setLoaderMsg("Deleting Assignment...");

        const dataPatch = await client
          .patch(detailData._id)
          .unset([
            `grades[_key=="${detailData?.grades?._key}"].studentfile[_key=="${fileKey}"]`,
          ])
          .commit({ autoGenerateArrayKeys: true });
      } finally {
        showLoader(false);
        location.reload();
      }
    }
  };

  const fetchDetail = useCallback(async () => {
    const id = params.id;
    try {
      showLoader(true);
      setLoaderMsg("Fetching Assignment Detail...");

      if (_id) {
        const data = await client.fetch(
          `*[_type == 'assignment' && _id == $_id]{
          ...,
          fileMaterials[] {
            asset->{
              _id,
              url,
              originalFilename,
              size,
              extension,
            }
          },
          ${
            !is_admin
              ? `grades[student._ref == $student_id] {
            ...,
            studentfile[]{
              ...,
              asset->{
                ...
              }
            }
          }[0],`
              : `grades[]{
                ...,
                student->{
                  name
                },
                  studentfile[]{
                  ...,
                  asset->{
                    ...
                  }
                  }
              }`
          } 
        }[0]`,
          { _id: id, student_id: _id }
        );

        setDetailData(data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      showLoader(false);
    }
  }, [_id, is_admin, params.id, setLoaderMsg, showLoader]);

  useEffect(() => {
    if (!detailData) {
      fetchDetail();
    }
  }, [_id, detailData, fetchDetail]);

  useEffect(() => {
    if (params.id) logUser({ taskId: params.id, taskType: "assignment" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return detailData ? (
    <Box px={4} pb={2}>
      <Container disableGutters maxWidth="lg">
        <Box>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            py={1}
          >
            <Typography variant="h6" fontWeight="bold" pt={1}>
              {detailData.title}
            </Typography>
            {is_admin ? (
              <Stack direction={"row"} spacing={2}>
                <IconButton size="small" onClick={() => handleDelete()}>
                  <Delete />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setOpenForm(true)}
                >
                  <Edit />
                </IconButton>
              </Stack>
            ) : null}
          </Stack>
          <img
            src={assignmentImage}
            style={{ width: "100%", maxHeight: "24em", objectFit: "cover" }}
          />

          {is_admin ? (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack>
                <Typography variant="caption">
                  Siswa mengumpulkan: {detailData?.grades?.length ?? "0"}
                </Typography>
                <Typography variant="caption">
                  Siswa dinilai:{" "}
                  {detailData?.grades?.filter((grade: any) => {
                    return grade?.grade;
                  }).length ?? "0"}
                  /{detailData?.grades?.length ?? "0"}
                </Typography>
                <Typography variant="caption">
                  Deadline:{" "}
                  {detailData.deadline
                    ? new Date(detailData.deadline).toLocaleString("id")
                    : "N/A"}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                sx={{ maxHeight: "2.5em" }}
                onClick={() => setOpenGrading(true)}
              >
                Nilai Siswa
              </Button>
            </Stack>
          ) : (
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack>
                <Typography variant="caption">
                  Nilai Tugas: {detailData?.grades?.grade ?? "Belum Dinilai"}
                </Typography>
                <Typography variant="caption">
                  Dikumpulkan pada:{" "}
                  {detailData?.grades?.studentfile?.length > 0
                    ? new Date(
                        detailData?.grades?.studentfile[0].asset?._updatedAt
                      ).toLocaleString("id")
                    : "Belum Mengumpulkan"}
                </Typography>
                <Typography variant="caption">
                  Deadline:{" "}
                  {detailData.deadline
                    ? new Date(detailData.deadline).toLocaleString("id")
                    : "N/A"}
                </Typography>
              </Stack>
              {!detailData?.grades ||
              detailData?.grades?.studentfile?.length === 0 ? (
                <Button
                  variant="contained"
                  sx={{ maxHeight: "2.5em" }}
                  onClick={() => {
                    if (assignmentRef.current) assignmentRef.current.click();
                  }}
                >
                  Kumpulkan Tugas
                </Button>
              ) : (
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                  {detailData?.grades?.studentfile?.map(
                    (dataStudent: any, index: number) => {
                      return (
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                          key={index}
                        >
                          <Box border={1} borderRadius={"8px"} boxShadow={2}>
                            <Box
                              borderRadius={"8px 8px 0 0"}
                              minWidth={178}
                              height={56}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                bgcolor: (theme) =>
                                  theme.palette.secondary.main,
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                textTransform={"uppercase"}
                              >
                                {dataStudent.asset?.extension}
                              </Typography>
                            </Box>
                            <Stack p={1}>
                              <Typography variant="caption">
                                {fileNameEllipsis(
                                  dataStudent.asset?.originalFilename ?? ""
                                )}
                              </Typography>
                              <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <Typography variant="caption">
                                  {formatBytes(dataStudent.asset?.size)}
                                </Typography>
                                <Stack direction={"row"} alignItems={"center"}>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                      window
                                        .open(
                                          handleSource(
                                            dataStudent.asset?.extension ?? "",
                                            dataStudent.asset?.url ?? ""
                                          ),
                                          "_blank"
                                        )
                                        ?.focus();
                                    }}
                                  >
                                    <Visibility fontSize={"small"} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                      if (assignmentRef.current) {
                                        setFileKey(dataStudent._key);
                                        assignmentRef.current.click();
                                      }
                                    }}
                                  >
                                    <Edit fontSize={"small"} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleDeleteAnswer(dataStudent._key)
                                    }
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Box>

                          {/* <Button
                      variant="contained"
                      sx={{ maxHeight: "2.5em" }}
                      onClick={() => {
                        if (assignmentRef.current) assignmentRef.current.click();
                      }}
                    >
                      Edit Tugas
                    </Button> */}
                        </Stack>
                      );
                    }
                  )}
                  {detailData?.grades?.studentfile?.length === 1 ? (
                    <Button
                      variant="contained"
                      sx={{ maxHeight: "2.5em" }}
                      onClick={() => {
                        if (assignmentRef.current)
                          assignmentRef.current.click();
                      }}
                    >
                      Tambah Jawaban
                    </Button>
                  ) : null}
                </Stack>
              )}
              <input
                ref={assignmentRef}
                type="file"
                hidden
                // multiple={
                //   !detailData?.grades ||
                //   detailData?.grades?.studentfile?.length === 0
                //     ? true
                //     : false
                // }
                onChange={handleSubmitAssignment}
              />
            </Stack>
          )}
          <Box py={2}>
            <Typography variant="h6">Deskripsi Tugas</Typography>
            <Typography variant="body2">{detailData.description}</Typography>
          </Box>
          <Divider role="presentation">
            <Circle fontSize="inherit" color="primary" />
          </Divider>

          <Box py={2}>
            <Typography variant="h6">File Pendukung</Typography>
            <a href={"#"} hidden ref={downloadRef}></a>
            {detailData.fileMaterials?.length > 0 ? (
              is_admin ? (
                <Stack direction={"row"} spacing={2} overflow={"auto"}>
                  {detailData.fileMaterials.map(
                    ({ asset }: any, index: number) => {
                      return (
                        <Box
                          border={1}
                          borderRadius={"8px"}
                          boxShadow={2}
                          key={index}
                        >
                          <Box
                            borderRadius={"8px 8px 0 0"}
                            minWidth={144}
                            height={56}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              bgcolor: (theme) => theme.palette.secondary.main,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              textTransform={"uppercase"}
                            >
                              {asset.extension}
                            </Typography>
                          </Box>
                          <Stack p={1}>
                            <Typography variant="caption">
                              {fileNameEllipsis(asset.originalFilename)}
                            </Typography>
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Typography variant="caption">
                                {formatBytes(asset.size)}
                              </Typography>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  if (downloadRef.current) {
                                    downloadRef.current.href = `${asset.url}?dl=`;
                                    downloadRef.current.click();
                                  }
                                }}
                              >
                                <Download fontSize={"small"} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      );
                    }
                  )}
                </Stack>
              ) : (
                <SwiperComponent dataToDisplay={detailData.fileMaterials} />
              )
            ) : (
              <Stack justifyContent="center" alignItems="center" py={4}>
                <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
                <Typography textAlign="center" variant="body1">
                  Tidak ada File Pendukung
                </Typography>
              </Stack>
            )}
          </Box>
          <Divider role="presentation">
            <Circle fontSize="inherit" color="primary" />
          </Divider>
        </Box>
      </Container>
      <AssignmentFormModal
        isEdit={true}
        dataToEdit={detailData}
        open={openForm}
        onClose={() => {
          location.reload();
          setOpenForm(false);
        }}
      />
      {params.id ? (
        <AssignmentGrading
          documentId={params.id}
          open={openGrading}
          onClose={() => {
            setOpenGrading(false);
          }}
          grades={detailData.grades}
        />
      ) : null}
    </Box>
  ) : null;
};

export default AssignmentDetail;
