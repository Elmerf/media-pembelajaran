import { Add, Edit, ReportProblem } from "@mui/icons-material";
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
import { useLocation } from "react-router-dom";

import moduleImage from "../../../assets/module-image.jpg";
import AssignmentCard from "../assignment/AssignmentCard";

const ModuleDetail: React.FC = () => {
  const location = useLocation();

  return (
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
              Judul Modul
            </Typography>
            <IconButton size="small">
              <Edit />
            </IconButton>
          </Stack>
          <img
            src={moduleImage}
            style={{ width: "100%", maxHeight: "24em", objectFit: "cover" }}
          />
          <Stack direction={"row"} justifyContent="space-between">
            <Typography variant="body2">Guru: Admin</Typography>
            <Typography variant="body2">
              {new Date().toLocaleString()}
            </Typography>
          </Stack>
          <Box py={2}>
            <Typography variant="h6">Tujuan Modul</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              perspiciatis alias reprehenderit vitae eaque ut ad, nostrum
              consectetur ipsa exercitationem mollitia inventore voluptas!
              Maxime perferendis fugiat perspiciatis excepturi libero iure!l
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              perspiciatis alias reprehenderit vitae eaque ut ad, nostrum
              consectetur ipsa exercitationem mollitia inventore voluptas!
              Maxime perferendis fugiat perspiciatis excepturi libero iure!l
            </Typography>
            <br />
            <Typography variant="body2">Lorem Ipsum:</Typography>
            <List>
              <ListItem>
                <Typography variant="body2">Lorem Ipsum</Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">Lorem Ipsum</Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">Lorem Ipsum</Typography>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box py={2}>
            <Typography variant="h6">Materi Pembelajaran</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              perspiciatis alias reprehenderit vitae eaque ut ad, nostrum
              consectetur ipsa exercitationem mollitia inventore voluptas!
              Maxime perferendis fugiat perspiciatis excepturi libero iure!l
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              perspiciatis alias reprehenderit vitae eaque ut ad, nostrum
              consectetur ipsa exercitationem mollitia inventore voluptas!
              Maxime perferendis fugiat perspiciatis excepturi libero iure!l
            </Typography>
            <img
              src={moduleImage}
              style={{
                width: "100%",
                maxHeight: "24em",
                objectFit: "cover",
                paddingBlock: "1em",
              }}
            />
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
              perspiciatis alias reprehenderit vitae eaque ut ad, nostrum
              consectetur ipsa exercitationem mollitia inventore voluptas!
              Maxime perferendis fugiat perspiciatis excepturi libero iure!l
            </Typography>
          </Box>
          <Divider />
          <Box py={2}>
            <Typography variant="h6">File Pendukung</Typography>
            <Stack justifyContent="center" alignItems="center" py={4}>
              <ReportProblem color="primary" sx={{ fontSize: "4em" }} />
              <Typography textAlign="center" variant="body1">
                Tidak ada File Pendukung
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <Box py={2}>
            <Typography variant="h6" pb={1}>
              Assignment
            </Typography>
            <Grid container justifyContent={"center"}>
              <Grid item xs={12} md={3}>
                <AssignmentCard />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ModuleDetail;
