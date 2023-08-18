import { Add, AddPhotoAlternate, Article, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  Grid,
  IconButton,
  ModalProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { MouseEventHandler } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { client } from "../../../lib/sanity-client";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import fileNameEllipsis from "../../../helpers/filename-ellipsis";
import formatBytes from "../../../helpers/format-bytes";
import { converToImg } from "../../../lib/sanity-img";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type AssignmentFormModal = {
  isEdit?: boolean;
  dataToEdit?: any;
  open: boolean;
  onClose: () => void;
};

const AssignmentFormModal: React.FC<AssignmentFormModal> = (props) => {
  const inputImgRef = useRef<HTMLInputElement>(null);
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const { session, showLoader, setLoaderMsg } = useContext(DashboardContext);

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File>();
  const [deadline, setDeadline] = useState<Dayjs | undefined>();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [previewImage, setPreviewImage] = useState("");

  const resetFields = () => {
    setTitle("");
    setCoverImage(undefined);
    setDeadline(undefined);
    setDescription("");
    setFiles([]);
    setPreviewImage("");
  };

  const handleChangeImage: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files) {
      const data = event.target.files[0];

      setCoverImage(data);
      setPreviewImage(URL.createObjectURL(data));
    }
  };

  const handleChangeFiles: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files) {
      const data = Array.from(event.target.files);
      setFiles((currFiles) => {
        // Convert current files array to an object with file names as keys
        const uniqueFileNames = currFiles.reduce<{ [key: string]: File }>(
          (acc, file) => {
            acc[file.name] = file;
            return acc;
          },
          {}
        );

        // Merge the new data with the existing unique files
        data.forEach((file) => {
          uniqueFileNames[file.name] = file;
        });

        // console.log(uniqueFileNames);

        // Convert the object back to an array of unique files
        const uniqueFiles = Object.values(uniqueFileNames);
        return uniqueFiles;
      });
    }
  };

  const handleRemoveFiles = (deleteIndex: number) => {
    if (deleteIndex >= 0) {
      setFiles((currFiles) => {
        return currFiles.filter((_, i) => i !== deleteIndex);
      });
    }
  };

  const handleRemoveUploadedFile = async (assetId: string, index: number) => {
    try {
      await client
        .patch(props.dataToEdit._id)
        .unset([`fileMaterial[${index}]`])
        .commit();

      await client.delete(assetId);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMutationModule = async () => {
    try {
      showLoader(true);
      const data: any = {
        _type: "assignment",
        title: title,
        description: description,
        deadline: deadline?.toISOString(),
      };

      if (coverImage) {
        setLoaderMsg("Uploading Cover Image...");
        const documentResponse = await client.assets.upload(
          "image",
          coverImage
        );
        data["coverImage"] = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: documentResponse._id,
          },
        };
      }

      const fileRefs = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setLoaderMsg(`Uploading File ${i + 1}/${files.length}`);
          const res = await client.assets.upload("file", files[i]);

          fileRefs.push({
            _type: "file",
            asset: {
              _type: "reference",
              _ref: res._id,
            },
          });
        }
      }

      if (fileRefs.length > 0) {
        data["fileMaterials"] = fileRefs;
      }

      if (props.isEdit) {
        setLoaderMsg("Updating Assignment...");
        const response = await client
          .patch(props.dataToEdit._id)
          .set(data)
          .commit();

        // console.log(response);
      } else {
        setLoaderMsg("Creating Assignment...");
        const response = await client.create(data, {
          autoGenerateArrayKeys: true,
        });
        // console.log(response);
      }

      if (props.onClose) props.onClose();
    } catch (e) {
      console.log(e);
    } finally {
      showLoader(false);
    }
  };

  useEffect(() => {
    if (!props.open) resetFields();
  }, [props.open]);

  useEffect(() => {
    if (props.isEdit) {
      // console.log(props.dataToEdit);
      const { title, deadline, description, coverImage } = props.dataToEdit;

      setTitle(title);
      setDeadline(dayjs(deadline));
      setDescription(description);
      if (coverImage?.asset?._ref)
        setPreviewImage(converToImg(coverImage.asset._ref).toString());
    }
  }, [props.dataToEdit, props.isEdit]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth={"sm"}
      fullWidth
      scroll="paper"
    >
      <Box p={4}>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Article color="primary" />
          <Typography variant="h5" fontWeight={700}>
            {props.isEdit ? "Edit Assignment" : "Assignment Baru"}
          </Typography>
        </Stack>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={3}>
                <Typography variant="body1" component={"span"}>
                  Judul Assignment
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={3}>
                <Typography variant="body1" component={"span"}>
                  Gambar Cover
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={inputImgRef}
                  onChange={handleChangeImage}
                />
                <Box
                  width={"100%"}
                  height={200}
                  border={1}
                  borderRadius={"4px"}
                  borderColor={(theme) => theme.palette.grey[400]}
                  position={"relative"}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview Image"
                      width={"100%"}
                      height={"100%"}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                  <ButtonBase
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      inset: 0,
                    }}
                    onClick={() => inputImgRef.current?.click()}
                  >
                    <AddPhotoAlternate
                      fontSize="large"
                      sx={{
                        color: (theme) => theme.palette.grey[400],
                        opacity: 0.4,
                      }}
                    />
                  </ButtonBase>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={3}>
                <Typography variant="body1" component={"span"}>
                  Deskripsi Assignment
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={3}>
                <Typography variant="body1" component={"span"}>
                  Deadline
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <DateTimePicker
                  sx={{ ".MuiInputBase-input": { padding: "8.5px 14px" } }}
                  value={deadline}
                  onChange={(e: any) => {
                    if (e) setDeadline(e);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={3}>
                <Typography variant="body1" component={"span"}>
                  File Pendukung
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <input
                  ref={inputFilesRef}
                  type="file"
                  multiple
                  onChange={handleChangeFiles}
                  hidden
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Add />}
                  onClick={() =>
                    inputFilesRef.current
                      ? inputFilesRef.current.click()
                      : () => {
                          // PLACEHOLDER
                        }
                  }
                >
                  Tambah File
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {files.length > 0 || props.dataToEdit?.fileMaterial?.length > 0 ? (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Stack direction={"row"} spacing={2} overflow={"auto"}>
                    {props.dataToEdit?.fileMaterial?.map(
                      ({ asset }: any, index: number) => {
                        return (
                          <Box border={1} borderRadius={"8px"} boxShadow={2}>
                            <Box
                              borderRadius={"8px 8px 0 0"}
                              minWidth={144}
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
                                  onClick={() =>
                                    handleRemoveUploadedFile(asset._id, index)
                                  }
                                >
                                  <Delete fontSize={"small"} />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Box>
                        );
                      }
                    )}
                    {files.map((file, index) => {
                      return (
                        <Box border={1} borderRadius={"8px"} boxShadow={2}>
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
                              {file.name.split(".")[1]}
                            </Typography>
                          </Box>
                          <Stack p={1}>
                            <Typography variant="caption">
                              {fileNameEllipsis(file.name)}
                            </Typography>
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Typography variant="caption">
                                {formatBytes(file.size)}
                              </Typography>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleRemoveFiles(index)}
                              >
                                <Delete fontSize={"small"} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
        <Stack direction={"row"} justifyContent={"end"} spacing={1} mt={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={props.onClose as MouseEventHandler<HTMLButtonElement>}
          >
            Kembali
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleMutationModule()}
          >
            {props.isEdit ? "Edit" : "Tambah Baru"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

AssignmentFormModal.defaultProps = {
  isEdit: false,
  dataToEdit: undefined,
};

export default AssignmentFormModal;
