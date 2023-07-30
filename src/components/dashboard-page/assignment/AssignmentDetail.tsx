import {
  Add,
  Circle,
  Download,
  Edit,
  ReportProblem,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import assignmentImage from "../../../assets/assignment-image.jpg";
import AssignmentCard from "../assignment/AssignmentCard";
import ModuleCard from "../modules/ModuleCard";
import { client } from "../../../lib/sanity-client";
import { useContext, useEffect, useRef, useState } from "react";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import fileNameEllipsis from "../../../helpers/filename-ellipsis";
import formatBytes from "../../../helpers/format-bytes";

const AssignmentDetail: React.FC = () => {
  const params = useParams();

  const {
    session: { is_admin, _id },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const downloadRef = useRef<HTMLAnchorElement>(null);
  const assignmentRef = useRef<HTMLInputElement>(null);

  const [detailData, setDetailData] = useState<any>();
  const [module, setModule] = useState<any>();

  const [openForm, setOpenForm] = useState(false);

  const handleSubmitAssignment: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.files) {
      const data = e.target.files[0];

      if (data) {
        showLoader(true);
        setLoaderMsg("Uploading Assignment...");
        const documentRes = await client.assets.upload("file", data);

        const dataPatch = await client
          .patch(detailData._id)
          .setIfMissing({ grades: [] })
          .append("grades", [
            {
              student: { _type: "reference", _ref: _id },
              studentfile: {
                _type: "file",
                asset: { _type: "reference", _ref: documentRes._id },
              },
            },
          ])
          .commit({ autoGenerateArrayKeys: true });

        console.log(dataPatch);
        showLoader(false);
      }
    }
  };

  useEffect(() => {
    const id = params.id;

    const fetchDetail = async () => {
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
              student,
              studentfile {
                asset->
              }
            }[0],`
                : ""
            } 
          }[0]`,
            { _id: id, student_id: _id }
          );

          const module = await client.fetch(
            "*[_type == 'module' && _id == $module_id][0]",
            {
              module_id: data.moduleMaterial._ref,
            }
          );

          setModule(module);
          setDetailData(data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        showLoader(false);
      }
    };

    if (!detailData) {
      fetchDetail();
    }
  }, [_id, detailData, is_admin, params.id, setLoaderMsg, showLoader]);

  return detailData ? (
    <Box px={4}>
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
              <IconButton size="small">
                <Edit />
              </IconButton>
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
                <Typography variant="caption">Siswa mengumpulkan:</Typography>
                <Typography variant="caption">Siswa dinilai: </Typography>
                <Typography variant="caption">
                  Deadline:{" "}
                  {detailData.deadline
                    ? new Date(detailData.deadline).toLocaleString("id")
                    : "N/A"}
                </Typography>
              </Stack>
              <Button variant="contained" sx={{ maxHeight: "2.5em" }}>
                Nilai Siswa
              </Button>
            </Stack>
          ) : (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack>
                <Typography variant="caption">
                  Nilai Tugas: {detailData?.grades?.grade ?? "Belum Dinilai"}
                </Typography>
                <Typography variant="caption">
                  Dikumpulkan pada:{" "}
                  {detailData?.grades?.studentfile?.asset?._updatedAt
                    ? new Date(
                        detailData?.grades?.studentfile?.asset?._updatedAt
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
              {!detailData?.grades?.studentfile?.asset?._updatedAt ? (
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
                <Typography>Sudah Mengumpulkan</Typography>
              )}
              <input
                ref={assignmentRef}
                type="file"
                hidden
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
          <Box py={2}>
            <Typography variant="h6" pb={1}>
              Module
            </Typography>
            {module ? (
              <Grid
                container
                py={1}
                direction={{ xs: "column", md: "row" }}
                rowSpacing={2}
                columnSpacing={{ xs: 0, md: 2 }}
              >
                <Grid item xs={12} md={3}>
                  <ModuleCard
                    coverImage={module.coverImage?.asset?._ref}
                    description={module.description}
                    id={module._id}
                    title={module.title}
                  />
                </Grid>
              </Grid>
            ) : (
              <Stack justifyContent="center" alignItems="center" py={4}>
                <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
                <Typography textAlign="center" variant="body1">
                  Tidak ada Module
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  ) : null;
};

export default AssignmentDetail;
