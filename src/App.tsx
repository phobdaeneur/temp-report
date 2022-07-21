import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import { StyledEngineProvider } from "@mui/material/styles";
import RouteGuard from "./views/RouteGuard";

function App() {
  return (
    <Router>
      <StyledEngineProvider injectFirst>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RouteGuard />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </StyledEngineProvider>
    </Router>
  );
}

export default App;
