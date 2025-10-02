import React, { type FC, lazy, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./pages/login";
import Dashboard from "./pages/dashboard";
import EditBikePage from "./pages/editPage";
import ViewBikePage from "./pages/viewPage";
import ProtectedRoute from "./components/protectedRoute";

const CustomRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Routes>
        <Route path="/login" element={<AuthForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id/" element={<EditBikePage />} />
          <Route path="/add" element={<EditBikePage />} />
          <Route path="/view/:id" element={<ViewBikePage />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default CustomRoutes;
