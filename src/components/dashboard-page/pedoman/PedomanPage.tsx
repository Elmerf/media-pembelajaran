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
import { DashboardContext } from "../../../layouts/DashboardLayout";
import { client } from "../../../lib/sanity-client";
import "./Sample.css";
import useUserLogger from "../../../hooks/useUserLogger";

const PedomanPage: React.FC = () => {
  const {
    session: { is_admin },
    showLoader,
    setLoaderMsg,
  } = useContext(DashboardContext);

  const { logUser } = useUserLogger();

  const inputRef = useRef<HTMLInputElement>(null);
  const [pedoman, setPedoman] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleEditPedoman = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleUploadPDF: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files) {
      const data = e.target.files[0];

      try {
        setLoading(true);
        showLoader(true);
        setLoaderMsg("Uploading, please wait...");

        const documentResponse = await client.assets.upload("file", data);

        const pedomanData = {
          _id: "pedoman-file-pdf",
          _type: "pedoman",
          pedomanFile: {
            _type: "file",
            asset: {
              _type: "reference",
              _ref: documentResponse._id,
            },
          },
        };

        const edit = await client.createOrReplace(pedomanData);

        if (edit) {
          location.reload();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        showLoader(false);
      }
    }
  };

  useEffect(() => {
    if (pedoman === undefined && !loading) {
      setLoading(true);
      showLoader(true);
      setLoaderMsg("Loading Pedoman...");
      client
        .fetch(
          `*[_type == 'pedoman']{
              pedomanFile {
                asset->{url}
              }
            }[0]
          `
        )
        .then((data) => {
          setPedoman(data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          showLoader(false);
        });
    }
  }, [loading, pedoman, setLoaderMsg, showLoader]);

  useEffect(() => {
    if (pedoman) logUser("Membuka Pedoman");
  }, [logUser, pedoman]);

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
              Pedoman Penggunaan Aplikasi
            </Typography>
            {is_admin ? (
              <IconButton size="small" onClick={() => handleEditPedoman()}>
                <Edit />
              </IconButton>
            ) : null}
          </Stack>
          {/* EMPTY STATE */}
          {pedoman ? (
            <iframe
              src={`${pedoman?.pedomanFile?.asset?.url as string}#view-fit`}
              width={"100%"}
              style={{ marginBlock: "1em", minHeight: "36em", border: 0 }}
            />
          ) : !loading ? (
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada Pedoman
              </Typography>
            </Stack>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
};

export default PedomanPage;
