import React, { useState, useRef } from "react";
import { baseURL } from "../config";
import stormcenter_logo from "../images/stormcenter_logo.png";

const WeatherInputForm = () => {
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        precipTotal: "",
        location: "",
    });
    const [picture, setPicture] = useState(null); // Separate state for the picture
    const pictureInputRef = useRef(null);
    const counties = [
        "Auglaize",
        "Butler",
        "Champaign",
        "Clark",
        "Clinton",
        "Darke",
        "Greene",
        "Logan",
        "Mercer",
        "Miami",
        "Montgomery",
        "Preble",
        "Randolph",
        "Shelby",
        "Warren",
        "Wayne",
        "Other", // Add 'Other' as the last option
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("name", formData.name);
            data.append("precipTotal", formData.precipTotal);
            data.append("location", formData.location);

            if (picture) {
                data.append("image", picture); // Correct name to match back-end
            }

            const response = await fetch(baseURL + "/createWeatherInput", {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                throw new Error("Failed to submit data");
            }

            const result = await response.json();
            setSuccessMessage("Weather data submitted successfully!");
            console.log("Server Response:", result);

            // Reset the form fields
            setFormData({
                email: "",
                name: "",
                precipTotal: "",
                location: "",
            });
            setPicture(null);
            pictureInputRef.current.value = null;
        } catch (error) {
            setSuccessMessage(`Error: ${error.message}`);
        }
    };

    const setSuccessMessage = (message) => {
        setMessage(message);

        // Reset the message after 5 seconds
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-12">
            <div className="flex justify-center items-center pb-8">
                <img
                    src={stormcenter_logo}
                    alt="Weather"
                    className="w-[300px] h-auto"
                />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                Tell Us What You're Seeing In The Miami Valley
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="precipTotal"
                        className="text-sm font-medium text-gray-700"
                    >
                        Precipitation Total (in inches)
                    </label>
                    <input
                        type="number"
                        name="precipTotal"
                        id="precipTotal"
                        value={formData.precipTotal}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700"
                    >
                        Location
                    </label>
                    <select
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                            Select a location
                        </option>
                        {counties.map((county) => (
                            <option key={county} value={county}>
                                {county}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="picture"
                        className="text-sm font-medium text-gray-700"
                    >
                        Upload Picture (optional)
                    </label>
                    <input
                        type="file"
                        name="image"
                        id="picture"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={pictureInputRef} // Add ref to the input element
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {message && (
                <p className="mt-4 text-center text-green-500 font-semibold">
                    {message}
                </p>
            )}
        </div>
    );
};

export default WeatherInputForm;
