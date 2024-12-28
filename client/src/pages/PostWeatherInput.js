import { useState, useRef } from "react";
import { baseURL } from "../config";
import { ClipLoader } from "react-spinners";
import stormcenter_logo from "../images/stormcenter_logo.png";
import { Autocomplete } from "@react-google-maps/api";

const WeatherInputForm = () => {
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        precipTotal: 0.0,
        location: "",
        city: "",
        showsDamage: false,
    });
    const [picture, setPicture] = useState(null);
    const [video, setVideo] = useState(null);
    const pictureInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const autocompleteRef = useRef(null);

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
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "precipTotal"
                    ? parseFloat(value) || ""
                    : value, // Handle checkbox input
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Front-end validation before sending the request
        if (!formData.email || !formData.name || !formData.location) {
            setMessage("All fields except pictures or videos are required.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("name", formData.name);
            data.append("precipTotal", parseFloat(formData.precipTotal));
            data.append("location", formData.location);
            data.append("city", formData.city);
            data.append("showsDamage", formData.showsDamage);

            console.log([...data.entries()]);
            console.log("Form submitted with city:", formData.city);

            if (picture) {
                data.append("image", picture); // Match the back-end name for images
            }

            if (video) {
                data.append("video", video); // Match the back-end name for videos
            }

            const response = await fetch(baseURL + "/inputs", {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.errors?.[0]?.message || "Failed to submit data"
                );
            }

            const result = await response.json();
            setSuccessMessage("Weather data submitted successfully!");
            console.log("Server Response:", result);

            // Reset the form fields
            setFormData({
                email: "",
                name: "",
                precipTotal: 0.0,
                location: "",
                city: "",
                showsDamage: false,
            });
            setPicture(null);
            setVideo(null);
            pictureInputRef.current.value = null;
            videoInputRef.current.value = null;
        } catch (error) {
            setSuccessMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const setSuccessMessage = (message) => {
        setMessage(message);

        // Reset the message after 5 seconds
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    const handleOnLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
        console.log("Autocomplete loaded", autocomplete);
    };

    const handleOnPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            setFormData({
                ...formData,
                city: place.formatted_address || place.name,
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
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
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700"
                    >
                        City
                    </label>

                    <Autocomplete
                        onLoad={handleOnLoad}
                        onPlaceChanged={handleOnPlaceChanged}
                    >
                        <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    city: e.target.value,
                                })
                            }
                            placeholder="Enter city name"
                            className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Autocomplete>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="precipTotal"
                        className="text-sm font-medium text-gray-700"
                    >
                        Precipitation Total (in inches) (optional)
                    </label>
                    <input
                        type="number"
                        name="precipTotal"
                        id="precipTotal"
                        value={formData.precipTotal}
                        onChange={handleChange}
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                        ref={pictureInputRef}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="video"
                        className="text-sm font-medium text-gray-700"
                    >
                        Upload Video (optional)
                    </label>
                    <input
                        type="file"
                        name="video"
                        id="video"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={videoInputRef}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="showsDamage"
                        className="text-sm font-medium text-gray-700"
                    >
                        Do these images/videos show damage? (optional)
                    </label>
                    <input
                        type="checkbox"
                        name="showsDamage"
                        id="showsDamage"
                        checked={formData.showsDamage}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
            {loading && (
                <div className="flex justify-center mt-4">
                    <ClipLoader size={50} color="#3498db" />
                </div>
            )}

            {message && (
                <p className="mt-4 text-center text-green-500 font-semibold">
                    {message}
                </p>
            )}
        </div>
    );
};

export default WeatherInputForm;
