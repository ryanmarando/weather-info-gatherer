import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from "./App";
import WeatherInputForm from "./pages/PostWeatherInput";
import Admin from "./pages/Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Analytics />
        <Router>
            <Routes>
                <Route path="/" element={<WeatherInputForm />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
