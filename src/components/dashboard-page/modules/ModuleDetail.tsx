import {
  Add,
  Circle,
  Delete,
  Download,
  Edit,
  ReportProblem,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import moduleImage from "../../../assets/module-image.jpg";
import AssignmentCard from "../assignment/AssignmentCard";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { client } from "../../../lib/sanity-client";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import formatBytes from "../../../helpers/format-bytes";
import fileNameEllipsis from "../../../helpers/filename-ellipsis";
import { converToImg } from "../../../lib/sanity-img";
import ModuleFormModal from "./ModuleFormModal";
import SwiperComponent from "../commons/SwiperComponent";
import useUserLogger from "../../../hooks/useUserLogger";

const ModuleDetail: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    session: { is_admin },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const { logUser } = useUserLogger();

  const downloadRef = useRef<HTMLAnchorElement>(null);

  const [detailData, setDetailData] = useState<any>();

  const [openForm, setOpenForm] = useState(false);

  const handleDelete = async () => {
    const id = params.id;

    if (confirm("Anda akan menghapus modul, lanjutkan?")) {
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

  const fetchDetail = useCallback(async () => {
    const id = params.id;
    try {
      showLoader(true);
      setLoaderMsg("Fetching Module Detail...");

      const data = await client.fetch(
        `*[_type == 'module' && _id == $_id]{
        ...,
        teacher->{
          name
        },
        fileMaterial[] {
          asset->{
            _id,
            url,
            originalFilename,
            size,
            extension,
          }
        },
      }[0]`,
        { _id: id }
      );

      logUser(`Membuka Modul - ${data.title}`);
      setDetailData(data);
    } catch (e) {
      console.log(e);
    } finally {
      showLoader(false);
    }
  }, [logUser, params.id, setLoaderMsg, showLoader]);

  useEffect(() => {
    if (!detailData) {
      fetchDetail();
    }
  }, [detailData, fetchDetail, params.id, setLoaderMsg, showLoader]);

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
            src={
              detailData?.coverImage
                ? converToImg(detailData.coverImage.asset._ref).toString()
                : moduleImage
            }
            style={{ width: "100%", maxHeight: "24em", objectFit: "cover" }}
          />
          <Stack direction={"row"} justifyContent="space-between">
            <Typography variant="body2">
              Guru: {detailData.teacher?.name}
            </Typography>
            <Typography variant="body2">
              Update: {new Date(detailData._updatedAt).toLocaleString()}
            </Typography>
          </Stack>
          <Box py={2}>
            <Typography variant="h6">Tujuan Modul</Typography>
            <Typography variant="body2">{detailData.goal}</Typography>
          </Box>
          <Divider role="presentation">
            <Circle fontSize="inherit" color="primary" />
          </Divider>
          <Box py={2}>
            <Typography variant="h6">Deskripsi Modul</Typography>
            <Typography variant="body2">{detailData.description}</Typography>
          </Box>
          <Divider role="presentation">
            <Circle fontSize="inherit" color="primary" />
          </Divider>
          <Box py={2}>
            <Typography variant="h6">File Pendukung</Typography>
            <a href={"#"} hidden ref={downloadRef}></a>
            {detailData.fileMaterial?.length > 0 ? (
              is_admin ? (
                <Stack direction={"row"} spacing={2} overflow={"auto"}>
                  {detailData.fileMaterial.map(
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
                <SwiperComponent dataToDisplay={detailData.fileMaterial} />
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
      <ModuleFormModal
        isEdit={true}
        dataToEdit={detailData}
        open={openForm}
        onClose={() => {
          location.reload();
          setOpenForm(false);
        }}
      />
    </Box>
  ) : null;
};

export default ModuleDetail;
