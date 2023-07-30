import { Card, Skeleton, CardContent, Stack } from "@mui/material";

const SkeletonCard: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 2, minHeight: "24em" }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={172}
        sx={{ backgroundColor: "grey.300" }}
      />
      <CardContent>
        <Skeleton
          variant="text"
          height={24}
          width="70%"
          sx={{ backgroundColor: "grey.300" }}
        />
        <Skeleton
          variant="text"
          height={16}
          width="90%"
          sx={{ backgroundColor: "grey.300" }}
        />
        <Skeleton
          variant="text"
          height={16}
          width="60%"
          sx={{ backgroundColor: "grey.300" }}
        />
        <Skeleton
          variant="text"
          height={16}
          width="80%"
          sx={{ backgroundColor: "grey.300" }}
        />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
