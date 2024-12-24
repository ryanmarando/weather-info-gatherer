import React, { useCallback, useState } from "react";
import DateMapComponent from "../components/DateMapComponent";
import CountySelector from "../components/CountySelector";
import WeatherInputs from "../components/WeatherInputs";
import ChangePasswordModal from "../components/ChangePasswordModal";
import LoginPage from "../components/LoginPage";
import { baseURL } from "../config";
import Papa from "papaparse";
import stormcenter_logo from "../images/stormcenter_logo.png";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [locationQuery, setlocationQuery] = useState("");
  const [timeStampStartQuery, setTimeStartStampQuery] = useState("");
  const [timeStampEndQuery, setTimeStampEndQuery] = useState("");
  const [admin, setAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const getAllWeatherInput = async () => {
    try {
      const response = await fetch(baseURL + "/inputs");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

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
    setTimeStartStampQuery(dateRange.startDate);
    setTimeStampEndQuery(dateRange.endDate);
    try {
      const response = await fetch(
        baseURL +
          "/inputs?startTime=" +
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
    setlocationQuery(selectedCountiesString);
    try {
      const response = await fetch(
        baseURL + "/inputs?location=" + selectedCountiesString
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
          "/inputs?location=" +
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
      const response = await fetch(`${baseURL}/inputs/${id}`, {
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

  const onEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`${baseURL}/inputs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        // Refresh the data or update the state
        console.log("Data updated successfully");
        alert("Updated data please re-sumbit to see changes");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLoginSubmitted = (isSubmitted, admin) => {
    setIsAdmin(true);
    if (isSubmitted) {
      setAdmin(admin);
    }
    if (admin.isNewAccount === true) {
      setShowChangePasswordModal(true);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const response = await fetch(`${baseURL}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      if (response.ok) {
        alert("Admin created successfully!");
        setShowModal(false);
        setNewAdmin({ email: "", name: "" });
      } else {
        alert("Failed to create admin.");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const response = await fetch(`${baseURL}/admins/${admin.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword, isNewAccount: false }),
      });
      if (response.ok) {
        alert("Password updated successfully.");
        setShowChangePasswordModal(false);
      } else {
        alert("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  if (error) {
    return <div className="text-red-600 text-lg">{error}</div>;
  }

  return (
    <div>
      {isAdmin ? (
        <div className="min-h-screen bg-gray-100 p-8">
          {showChangePasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowChangePasswordModal(false)}
              onSave={handlePasswordChange}
            />
          )}
          {admin?.id === 1 && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Create Admin
              </button>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAdmin}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center pb-8">
            <img
              src={stormcenter_logo}
              alt="Weather"
              className="w-[300px] h-auto"
            />
          </div>
          <h1 className="text-4xl font-semibold text-center mb-6">
            Welcome, {admin.name}
          </h1>

          <div className="mb-6 text-center">
            <button
              onClick={getAllWeatherInput}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition w-full max-w-md mx-auto"
            >
              Get All Data
            </button>
          </div>

          {/* Centered Date Range and County Selector */}
          <div className="flex justify-between gap-6 mb-6 w-full max-w-7xl mx-auto">
            <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                <DateMapComponent onDateRangeChange={handleDateRangeChange} />
                <button
                  onClick={submitDateRangeData}
                  className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition w-full"
                >
                  Get Weather Data For Range Only
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Select Counties</h2>
                <CountySelector
                  onSelectedCountiesChange={handleSelectedCountiesChange}
                />
                <button
                  onClick={submitDataLocation}
                  className="mt-4 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 transition w-full"
                >
                  Get Weather Data For Location Only
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-xl mb-4 text-center">
            Data Query for locations {selectedCounties.join(", ")} during{" "}
            {dateRange.startDate} to {dateRange.endDate}
          </h3>

          {/* The Last Button Below the Two Boxes */}
          <div className="mb-6 text-center">
            <button
              onClick={submitDataLocationAndTime}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition w-full max-w-md mx-auto"
            >
              Get Weather Data For Selected Location and Dates
            </button>
          </div>

          <WeatherInputs
            data={data}
            onDelete={handleDelete}
            onEdit={onEdit}
            locationQuery={locationQuery}
            timeStampStartQuery={timeStampStartQuery}
            timeStampEndQuery={timeStampEndQuery}
          />

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
      ) : (
        <LoginPage onSubmit={handleLoginSubmitted} />
      )}
    </div>
  );
}

export default App;
