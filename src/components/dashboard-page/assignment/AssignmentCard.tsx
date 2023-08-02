import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import assignmentImage from "../../../assets/assignment-image.jpg";
import { converToImg } from "../../../lib/sanity-img";
import { useContext } from "react";
import { DashboardContext } from "../../../layouts/DashboardLayout";

type AssignmentCard = {
  id?: string;
  title?: string;
  description?: string;
  coverImage?: string;
  deadline?: string;
};

const AssignmentCard: React.FC<AssignmentCard> = (props) => {
  const {
    session: { is_admin },
  } = useContext(DashboardContext);

  return (
    <Card
      variant="outlined"
      sx={{ boxShadow: 2, height: "100%", minHeight: 380 }}
    >
      <CardMedia
        component="img"
        image={
          props.coverImage
            ? converToImg(props.coverImage).toString()
            : assignmentImage
        }
        height={144}
      />
      <CardContent
        sx={{
          height: "calc(100% - 144px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight="bold">
            {props.title}
          </Typography>
          <Typography variant="body2">
            {props.description && props.description.length > 200
              ? props.description.substring(0, 200).trim().concat("...")
              : props.description}
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption">
            Deadline:{" "}
            {props.deadline ? new Date(props.deadline).toLocaleString() : "N/A"}
          </Typography>
          <Stack justifyContent="end" spacing={2} direction="row">
            <Button
              variant="contained"
              size="small"
              sx={{ width: "48%" }}
              color="secondary"
            >
              <Link
                underline="none"
                component={RouterLink}
                to={`/dashboard/assignment/${props.id}`}
                variant="body2"
                color={"black"}
              >
                Lihat Detail
              </Link>
            </Button>
            {/* {is_admin ? (
              <Button
                variant="contained"
                size="small"
                sx={{ width: "48%" }}
                color="primary"
              >
                Nilai Siswa
              </Button>
            ) : null} */}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
