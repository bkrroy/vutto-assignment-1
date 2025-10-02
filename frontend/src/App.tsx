import React from "react";
import logo from "./logo.svg";
import { BrowserRouter } from "react-router-dom";
import CustomRoutes from "./routes";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL as string}>
      <CustomRoutes />
    </BrowserRouter>
  );
}

export default App;
