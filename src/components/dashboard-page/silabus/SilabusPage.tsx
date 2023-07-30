import { Add, Edit, ReportProblem } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { OnDocumentLoadSuccess } from "react-pdf/dist/cjs/shared/types";
// import ModuleCard from "./ModuleCard";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./Sample.css";
import { client } from "../../../lib/sanity-client";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import { useLocation } from "react-router-dom";

const SilabusPage: React.FC = () => {
  // const [numPages, setNumPages] = useState<number>();

  // const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };
  const {
    session: { is_admin },
  } = useContext(DashboardContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const [silabus, setSilabus] = useState<any>();

  const handleEditSilabus = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUploadPDF: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files) {
      const data = e.target.files[0];

      const documentResponse = await client.assets.upload("file", data);

      const silabusData = {
        _id: "silabus-file-pdf",
        _type: "silabus",
        silabusFile: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: documentResponse._id,
          },
        },
      };
      const edit = await client.createOrReplace(silabusData);

      if (edit) {
        location.reload();
      }
    }
  };

  useEffect(() => {
    client
      .fetch(
        `*[_type == 'silabus']{
            silabusFile {
              asset->{url}
            }
          }[0]
        `
      )
      .then((data) => {
        setSilabus(data);
      });
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
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleUploadPDF}
          />
          <Stack
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Typography variant="h6" fontWeight="bold" pt={1}>
              Silabus
            </Typography>
            {is_admin ? (
              <IconButton size="small" onClick={() => handleEditSilabus()}>
                <Edit />
              </IconButton>
            ) : null}
          </Stack>
          {/* <Box className="Example__container__document">
            <Document
              options={{
                cMapUrl: "cmaps/",
                cMapPacked: true,
              }}
              file="/sample.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </Box> */}
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
          {silabus ? (
            <iframe
              src={`${silabus?.silabusFile?.asset?.url as string}#view-fit`}
              width={"100%"}
              style={{ marginBlock: "1em", minHeight: "36em" }}
            />
          ) : (
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada Silabus
              </Typography>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SilabusPage;
