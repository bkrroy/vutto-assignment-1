import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

type Bike = {
  id: number;
  model: string;
  brand: string;
  year: number;
  price: string;
  image: string;
};

interface ViewBikeProps {
  bike: Bike;
  onBack: () => void;
}

export default function ViewBikePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bike = location.state?.bike;
  //   const bike = {
  //     id: 1,
  //     model: "Ninja ZX-10R",
  //     brand: "Kawasaki",
  //     year: 2022,
  //     price: "₹15,99,000",
  //     image: "https://d1zm6mf795n3f0.cloudfront.net/1758795280596_5__small.png",
  //   };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{ background: "#f9fafb", p: 3 }}
    >
      <Card
        sx={{
          width: 700,
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Bike Image */}
        <CardMedia
          component="img"
          height="350"
          image={bike.imageUrl}
          alt={bike.model}
          sx={{
            objectFit: "cover",
          }}
        />

        <CardContent>
          {/* Title & Price */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#2c3e50" }}
            >
              {bike.model}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg,#ff6f61,#ff9472)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {bike.price}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Bike Details */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Brand:
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {bike.brand}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Manufacture Year:
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {bike.year}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Price:
            </Typography>
            <Typography color="text.secondary">Rs. {bike.price}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Model Name:
            </Typography>
            <Typography color="text.secondary">{bike.model}</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Kilometers:
            </Typography>
            <Typography color="text.secondary">
              {bike.kilometers_driven}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Location:
            </Typography>
            <Typography color="text.secondary">{bike.location}</Typography>
          </Box>

          <Box mt={3} textAlign="right" alignContent={"right"}>
            <Button
              onClick={() => {
                navigate(`/edit/${bike.id}/`, { state: { bike } });
              }}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                borderColor: "#ff6f61",
                color: "#ff9472",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff9472,#ff6f61)",
                  color: "#ffff",
                },
                marginRight: "20px",
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                navigate("/dashboard");
              }}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                background: "linear-gradient(90deg,#ff6f61,#ff9472)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff9472,#ff6f61)",
                },
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
