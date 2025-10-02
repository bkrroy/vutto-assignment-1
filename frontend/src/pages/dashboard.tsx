import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Pagination,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import axios from "axios";
import { BikeType } from "../components/interfaces";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import { getCookie } from "../components/cookieInfo";
import { API_URL } from "../services";

// Dummy data
const bikes = [
  {
    id: 1,
    model: "Ninja ZX-10R",
    brand: "Kawasaki",
    year: 2022,
    price: "₹15,99,000",
    image: "https://d1zm6mf795n3f0.cloudfront.net/1758795280596_5__small.png",
  },
  {
    id: 2,
    model: "Duke 390",
    brand: "KTM",
    year: 2023,
    price: "₹3,10,000",
    image:
      "https://www.ktm.com/content/dam/ktm/common/bike/duke-390/duke-390-my23.jpg",
  },
  {
    id: 3,
    model: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    year: 2021,
    price: "₹2,10,000",
    image:
      "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/classic-350/colors/classic350-marsh-grey.jpg",
  },
  {
    id: 4,
    model: "Hayabusa",
    brand: "Suzuki",
    year: 2023,
    price: "₹16,90,000",
    image: "https://cdn.bikebd.com/2021/04/suzuki-hayabusa-2021.jpg",
  },
  {
    id: 5,
    model: "R15 V4",
    brand: "Yamaha",
    year: 2022,
    price: "₹1,80,000",
    image: "https://www.yamaha-motor-india.com/theme/v4-2022.jpg",
  },
  {
    id: 6,
    model: "Dominar 400",
    brand: "Bajaj",
    year: 2021,
    price: "₹2,20,000",
    image:
      "https://www.bajajauto.com/-/media/Images/brand-dominar/dominar400/Dominar400-green.png",
  },
];

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [bikeList, setBikeList] = useState<BikeType[]>([]);
  const bikesPerPage = 10;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setDebouncedTerm(searchTerm);
    }, 1000); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // call list bike API
  useEffect(() => {
    if (!selected) {
      axios
        .get(`${API_URL}/bikes/?page=${page}&search=${debouncedTerm}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log("bikes");
          console.log(res.data.results);
          setCount(res.data.count);
          setBikeList(res.data.results ?? []);
        });
    }
  }, [page, selected, debouncedTerm]);

  useEffect(() => {
    if (selected) {
      axios
        .get(`${API_URL}/bikes/mine/?page=${page}&search=${debouncedTerm}`, {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        })
        .then((res) => {
          console.log("bikes");
          console.log(res.data.results);
          setCount(res.data.count);
          setBikeList(res.data.results ?? []);
        });
    }
  }, [page, selected, debouncedTerm]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * bikesPerPage;
  const paginatedBikes = bikes.slice(startIndex, startIndex + bikesPerPage);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Bike Dashboard
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/add")}
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
            Add Bikes
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              if (!selected) {
              }
              setSelected((prev) => !prev);
            }}
            startIcon={selected ? <CheckIcon /> : null} // show tick if selected
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderColor: selected ? "#32CD32" : "#FFA500", // optional color change
              color: "#2c3e50",
              "&:hover": {
                borderColor: "#32CD32",
                backgroundColor: "rgba(50,205,50,0.1)", // subtle hover effect
              },
            }}
          >
            My Listing
          </Button>
        </Box>

        <Stack direction={"row"} spacing={4}>
          <TextField
            placeholder="Search by model or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", sm: "300px" } }}
          />

          <Button
            variant="contained"
            onClick={() => {
              document.cookie = `access="NA"; path=/; Secure; SameSite=Strict`;
              document.cookie = `refresh="NA"; path=/; Secure; SameSite=Strict`;
              navigate("/login");
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
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Bike Grid */}
      <Grid container spacing={3}>
        {bikeList.map((bike) => {
          return (
            <Grid
              onClick={() => {
                navigate(`/view/${bike.id}/`, { state: { bike } });
              }}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={bike.id}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    cursor: "pointer",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={bike.imageUrl}
                  alt={bike.model}
                  sx={{
                    objectFit: "fill",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#2c3e50" }}
                  >
                    {bike.model}
                  </Typography>
                  <Typography color="text.secondary">{bike.brand}</Typography>
                  <Typography color="text.secondary">
                    Year: {bike.year}
                  </Typography>
                  <Typography color="text.secondary">
                    Kilometers: {bike.kilometers_driven}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      background: "linear-gradient(90deg,#ff6f61,#ff9472)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Rs. {bike.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(count / bikesPerPage)}
          page={page}
          onChange={handleChange}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              background: "linear-gradient(90deg,#ff6f61,#ff9472) !important",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
  );
}
