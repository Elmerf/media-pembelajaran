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
import moduleImage from "../../../assets/module-image.jpg";
import { converToImg } from "../../../lib/sanity-img";

type ModuleCard = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
};

const ModuleCard: React.FC<ModuleCard> = (props) => {
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
            : moduleImage
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
            {props.description.length > 200
              ? props.description.substring(0, 200).trim().concat("...")
              : props.description}
          </Typography>
        </Stack>
        <Stack justifyContent="end" direction="row">
          <Button
            variant="contained"
            size="small"
            sx={{ width: "48%" }}
            color="secondary"
          >
            <Link
              underline="none"
              component={RouterLink}
              to={`/dashboard/module/${props.id}`}
              variant="body2"
              color={"black"}
            >
              Lihat Detail
            </Link>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
