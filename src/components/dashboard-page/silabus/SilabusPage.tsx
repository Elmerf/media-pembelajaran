import { Edit, ReportProblem } from "@mui/icons-material";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
// import ModuleCard from "./ModuleCard";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useUserLogger from "../../../hooks/useUserLogger";
import { DashboardContext } from "../../../layouts/DashboardLayout";
import { client } from "../../../lib/sanity-client";
import "./Sample.css";

const SilabusPage: React.FC = () => {
  const {
    session: { is_admin },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const { logUser } = useUserLogger();

  const inputRef = useRef<HTMLInputElement>(null);
  const [silabus, setSilabus] = useState<any>();
  const [loading, setLoading] = useState(false);

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
    if (!silabus) {
      setLoading(true);
      showLoader(true);
      setLoaderMsg("Loading Silabus...");
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
        })
        .finally(() => {
          setLoading(false);
          showLoader(false);
        });
    }
  }, [setLoaderMsg, showLoader, silabus]);

  useEffect(() => {
    if (silabus) logUser("Membuka Silabus");
  }, [logUser, silabus]);

  return (
    <Box px={4}>
      <Container disableGutters maxWidth="lg">
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
          {/* EMPTY STATE */}
          {silabus ? (
            <iframe
              src={`${silabus?.silabusFile?.asset?.url as string}#view-fit`}
              width={"100%"}
              style={{ marginBlock: "1em", minHeight: "36em", border: 0 }}
            />
          ) : !loading ? (
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada Silabus
              </Typography>
            </Stack>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
};

export default SilabusPage;
