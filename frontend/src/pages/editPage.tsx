import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BikeType } from "../components/interfaces";
import axios from "axios";
import { getCookie } from "../components/cookieInfo";
import { API_URL } from "../services";

type Bike = {
  id: number;
  model: string;
  brand: string;
  year: number;
  price: string;
  imageUrl: string;
};

interface EditBikeProps {
  bike: Bike;
  onSave: (updatedBike: Bike) => void;
  onDelete: (id: number) => void;
}

export default function EditBikePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<BikeType>(
    location.state?.bike ?? []
  );
  const params = useParams();
  const pathName = location.pathname.split("/")[1];
  console.log("PARAMS", pathName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("formData", formData);
    if (pathName === "edit") {
      axios
        .patch(`${API_URL}/bikes/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        })
        .then((res) => {
          navigate(`/view/${formData.id}/`, { state: { bike: formData } });
        })
        .catch((err) => {
          if (err.status === 401) {
            navigate("/login");
          }
        });
    }

    if (pathName === "add") {
      axios
        .post(`${API_URL}/bikes/`, formData, {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        })
        .then((res) => {
          navigate(`/view/${res.data.id}/`, { state: { bike: res.data } });
        })
        .catch((err) => {
          if (err.stats === 401) {
            navigate("/login");
          }
        });
    }

    // onSave(formData);
  };

  const handleDelete = () => {
    if (pathName === "edit") {
      if (window.confirm("Are you sure you want to delete this bike?")) {
        axios
          .delete(`${API_URL}/bikes/${formData.id}/`, {
            headers: {
              Authorization: `Bearer ${getCookie("access")}`,
            },
          })
          .then((res) => {
            if (res.status === 204) {
              navigate("/dashboard");
            }
          })
          .catch((err) => {
            if (err.status === 401) {
              navigate("/login");
            }
          });
      }
    }

    if (pathName === "add") {
      navigate("/dashboard");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#f9fafb", p: 3 }}
    >
      <Card
        sx={{
          width: 500,
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 2, color: "#2c3e50" }}
          >
            Edit Bike
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              required={true}
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="Kilometers"
              name="kilometers_driven"
              value={formData.kilometers_driven}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required={true}
              label="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              onClick={handleDelete}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                background: "#e74c3c",
                color: "#fff",
                "&:hover": { background: "#c0392b" },
              }}
            >
              {pathName === "add" ? "Go Back" : "Delete"}
            </Button>

            <Button
              onClick={handleSave}
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
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
