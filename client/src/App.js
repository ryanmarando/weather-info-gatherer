import React, { useCallback, useState } from "react";
import DateMapComponent from "./components/DateMapComponent";
import CountySelector from "./components/CountySelector";
import WeatherInputs from "./components/WeatherInputs";
import { baseURL } from "./config";
import Papa from "papaparse"; // Import PapaParse

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedCounties, setSelectedCounties] = useState([]);

  // Fetch all weather inputs
  const getAllWeatherInput = async () => {
    try {
      const response = await fetch(baseURL + "/getAllWeatherInputs");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  // Function to download data as CSV using PapaParse
  const downloadCSV = () => {
    try {
      const csv = Papa.unparse(data); // Convert the data to CSV format
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Create a Blob for the file
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "weather_data.csv"); // Set the file name
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up the DOM
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const clearAllWeatherInputs = () => {
    setData([]);
  };

  const sortedWeatherInputs = () => {
    let sortedData = [...data];
    sortedData.sort((a, b) => {
      if (b.precipTotal !== a.precipTotal) {
        return b.precipTotal - a.precipTotal;
      }
      return a.email.localeCompare(b.email);
    });
    setData(sortedData);
  };

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  const submitDateRangeData = async () => {
    if (dateRange.startDate === "" || dateRange.endDate === "")
      return alert("Please choose times.");
    try {
      const response = await fetch(
        baseURL +
          "/getWeatherInput?startTime=" +
          dateRange.startDate +
          "&endTime=" +
          dateRange.endDate
      );
      if (!response.ok) {
        alert("No data found in those ranges");
        return;
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const handleSelectedCountiesChange = (counties) => {
    setSelectedCounties(counties);
  };

  const submitDataLocation = async () => {
    if (selectedCounties.length === 0) return alert("Please choose counties.");
    const selectedCountiesString = selectedCounties.join(",");
    try {
      const response = await fetch(
        baseURL + "/getWeatherInput?location=" + selectedCountiesString
      );
      if (!response.ok) {
        alert("No data found in those locations");
        return;
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const submitDataLocationAndTime = async () => {
    if (dateRange.startDate === "" || dateRange.endDate === "")
      return alert("Please choose times.");
    if (selectedCounties.length === 0) return alert("Please choose counties.");
    const selectedCountiesString = selectedCounties.join(",");
    try {
      const response = await fetch(
        baseURL +
          "/getWeatherInput?location=" +
          selectedCountiesString +
          "&startTime=" +
          dateRange.startDate +
          "&endTime=" +
          dateRange.endDate
      );
      if (!response.ok) {
        alert("No data found in those locations and or time period.");
        return;
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseURL}/deleteWeatherInput/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete weather input:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting weather input:", error);
    }
  };

  if (error) {
    return <div className="text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-semibold text-center mb-6">
        Weather Data Admin
      </h1>

      <div className="mb-6 text-center">
        <button
          onClick={getAllWeatherInput}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition w-full max-w-md mx-auto"
        >
          Get All Data
        </button>
      </div>

      {/* Centered Date Range and County Selector */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <DateMapComponent onDateRangeChange={handleDateRangeChange} />
            <button
              onClick={submitDateRangeData}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition w-full"
            >
              Get Weather Data For Range Only
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Counties</h2>
            <CountySelector
              onSelectedCountiesChange={handleSelectedCountiesChange}
            />
            <button
              onClick={submitDataLocation}
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition w-full"
            >
              Get Weather Data For Location Only
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={submitDataLocationAndTime}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition w-full"
            >
              Get Weather Data For Selected Location and Dates
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-xl mb-4 text-center">
        Showing Data for locations {selectedCounties.join(", ")} during{" "}
        {dateRange.startDate} to {dateRange.endDate}
      </h3>

      <WeatherInputs data={data} onDelete={handleDelete} />

      <div className="mt-4 flex justify-between px-6">
        {data.length > 0 && (
          <>
            <button
              onClick={sortedWeatherInputs}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
            >
              Sort By Amount
            </button>
            <button
              onClick={clearAllWeatherInputs}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Clear Data
            </button>
            {/* CSV Download Button */}
            <button
              onClick={downloadCSV}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 transition"
            >
              Download CSV
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
