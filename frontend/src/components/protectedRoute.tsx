import { useState, useEffect } from "react";
import { getCookie } from "./cookieInfo";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .post(
        `${API_URL}/auth/token/refresh/`,
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
        setAuthenticated(true);
      })
      .catch((err) => {
        console.log("Error");
        console.log(err);
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
