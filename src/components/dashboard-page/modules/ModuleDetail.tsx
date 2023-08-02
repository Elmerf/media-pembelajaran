import {
  Add,
  Circle,
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
import { useLocation, useParams } from "react-router-dom";

import moduleImage from "../../../assets/module-image.jpg";
import AssignmentCard from "../assignment/AssignmentCard";
import { useContext, useEffect, useRef, useState } from "react";
import { client } from "../../../lib/sanity-client";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import formatBytes from "../../../helpers/format-bytes";
import fileNameEllipsis from "../../../helpers/filename-ellipsis";
import { converToImg } from "../../../lib/sanity-img";
import ModuleFormModal from "./ModuleFormModal";
import SwiperComponent from "../commons/SwiperComponent";

const ModuleDetail: React.FC = () => {
  const params = useParams();

  const {
    session: { is_admin },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const downloadRef = useRef<HTMLAnchorElement>(null);

  const [detailData, setDetailData] = useState<any>();

  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const id = params.id;

    const fetchDetail = async () => {
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

        setDetailData(data);
      } catch (e) {
        console.log(e);
      } finally {
        showLoader(false);
      }
    };

    if (!detailData) {
      fetchDetail();
    }

    const subscribeDetail = client
      .listen(
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
      )
      .subscribe(({ result }) => {
        setDetailData(result);
      });

    return () => {
      subscribeDetail.unsubscribe();
    };
  }, [detailData, params.id, setLoaderMsg, showLoader]);

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
              <IconButton size="small" onClick={() => setOpenForm(true)}>
                <Edit />
              </IconButton>
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
