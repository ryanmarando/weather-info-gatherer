import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App"; // If you have a global App component, you can import it here
import WeatherInputForm from "./pages/PostWeatherInput";
import Admin from "./pages/Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ClipLoader } from "react-spinners";

const root = ReactDOM.createRoot(document.getElementById("root"));
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_GEOGRAPHIC_ENCODER_KEY;

const App = () => {
    const [loading, setLoading] = useState(true);

    // Function to load Google Maps API
    useEffect(() => {
        if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => {
                setLoading(false); // Google Maps API loaded
            };
            script.onerror = () => {
                console.error("Google Maps API failed to load");
                setLoading(false); // Handle error case
            };
            document.body.appendChild(script);
        } else {
            setLoading(false); // Script is already loaded
        }
    }, []);

    return (
        <React.StrictMode>
            <Analytics />
            <Router>
                {loading ? (
                    // Show loading spinner while Google Maps API is loading
                    <div className="flex justify-center items-center h-screen">
                        <ClipLoader size={50} color="#3498db" />
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<WeatherInputForm />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                )}
            </Router>
        </React.StrictMode>
    );
};

root.render(<App />);
