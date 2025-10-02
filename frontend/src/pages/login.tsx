import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { getCookie } from "../components/cookieInfo";
import { useNavigate } from "react-router-dom";

// process.env.REACT_APP_API_URL

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/auth/token/refresh/`,
        {
          refresh: getCookie("refresh"),
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("RESSS ===>> ");
        console.log(res.data);
        const { access } = res.data;

        // 3️⃣ Update cookies with new tokens
        document.cookie = `access=${access}; path=/; Secure; SameSite=Strict`;
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error");
        console.log(err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/auth/token/`, {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          const { access, refresh } = res.data;

          // 3️⃣ Update cookies with new tokens
          document.cookie = `access=${access}; path=/; Secure; SameSite=Strict`;
          document.cookie = `refresh=${refresh}; path=/; Secure; SameSite=Strict`;
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log("login Error");
          console.log(err.response.data.detail);
          setErrorMessage(err.response.data.detail);
        });
      console.log("Login:", formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      axios
        .post(`${process.env.REACT_APP_API_URL}/auth/register/`, {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          const { access, refresh } = res.data;

          // 3️⃣ Update cookies with new tokens
          document.cookie = `access=${access}; path=/; Secure; SameSite=Strict`;
          document.cookie = `refresh=${refresh}; path=/; Secure; SameSite=Strict`;
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log("login Error");
          console.log(err.response.data.detail);
          setErrorMessage(err.response.data.email);
        });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#f9fafb" }}
    >
      <Card
        sx={{
          width: 380,
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
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </Typography>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, newValue) => {
              setTab(newValue);
              setErrorMessage("");
            }}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Register" value="register" />
          </Tabs>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            {tab === "register" && (
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}
            <Typography color="red">{errorMessage}</Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: 2,
                background: "linear-gradient(90deg,#ff6f61,#ff9472)",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff9472,#ff6f61)",
                },
              }}
            >
              {tab === "login" ? "Login" : "Register"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
