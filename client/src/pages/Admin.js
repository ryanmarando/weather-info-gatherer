import React, { useCallback, useState } from "react";
import DateMapComponent from "../components/DateMapComponent";
import CountySelector from "../components/CountySelector";
import WeatherInputs from "../components/WeatherInputs";
import ChangePasswordModal from "../components/ChangePasswordModal";
import LoginPage from "../components/LoginPage";
import { baseURL } from "../config";
import Papa from "papaparse";
import stormcenter_logo from "../images/stormcenter_logo.png";
import ReactAnimatedWeather from "react-animated-weather";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
  const [token, setToken] = useState(null);
  const [showAdminListModal, setShowAdminListModal] = useState(false);
  const [adminList, setAdminList] = useState([]);

  const weatherWind = {
    icon: "WIND",
    color: "goldenrod",
    size: 80,
    animate: true,
  };

  const handleLoginSuccess = (success, token, admin) => {
    if (success) {
      setIsAdmin(true);
      setToken(token);
      setAdmin(admin);
      if (admin.isNewAccount) {
        setShowChangePasswordModal(true);
      }
    } else {
      setIsAdmin(false);
      setToken("");
      setAdmin({
        email: "",
        name: "",
      });
    }
  };

  const getAllWeatherInput = async () => {
    try {
      setMessage("Loading...");
      setLoading(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(baseURL + "/inputs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      const data = await response.json();

      if (data.error) {
        return setMessage("No data found...");
      }
      await delay;
      setData(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const downloadCSV = () => {
    try {
      setMessage("Loading...");
      setLoading(true);
      // Map the data to include only the fields you need for each row
      const formattedData = data.map((item) => ({
        id: item.id,
        city: item.city,
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      // Convert the formatted data to CSV format
      const csv = Papa.unparse(formattedData);

      // Create a Blob for the file
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Create a link element and set the download attributes
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "weather_data.csv"); // Set the file name
      link.style.visibility = "hidden";

      // Append the link to the document body, trigger the click, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage("Successful CSV download...");
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
    if (sortedData.length === 0) {
      setLoading(true);
      return setMessage("No data found.");
    }
    setData(sortedData);
  };

  const sortedWeatherInputsByDamage = () => {
    let sortedData = [...data];
    sortedData = sortedData.filter((item) => item.showsDamage === true);
    if (sortedData.length === 0) {
      setLoading(true);
      return setMessage("No data found with damage.");
    }
    setData(sortedData);
  };

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  const submitDateRangeData = async () => {
    setMessage("Loading...");
    setLoading(true);
    if (dateRange.startDate === "" || dateRange.endDate === "")
      return setMessage("Please choose times.");
    setTimeStartStampQuery(dateRange.startDate);
    setTimeStampEndQuery(dateRange.endDate);
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        baseURL +
          "/inputs?startTime=" +
          dateRange.startDate +
          "&endTime=" +
          dateRange.endDate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (!response.ok) {
        setMessage("No data found in those ranges");
        return;
      }
      const data = await response.json();
      await delay;
      setData(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const handleSelectedCountiesChange = (counties) => {
    setSelectedCounties(counties);
  };

  const submitDataLocation = async () => {
    if (selectedCounties.length === 0) {
      setLoading(true);
      return setMessage("Please choose counties.");
    }
    const selectedCountiesString = selectedCounties.join(",");
    setlocationQuery(selectedCountiesString);
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(true);
      setMessage("Loading...");
      const response = await fetch(
        baseURL + "/inputs?location=" + selectedCountiesString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (!response.ok) {
        setMessage("No data found in those locations");
        //setMessage("No data found in those locations");
        return;
      }
      const data = await response.json();
      await delay;
      setData(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const submitDataLocationAndTime = async () => {
    setLoading(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 1000));
    if (dateRange.startDate === "" || dateRange.endDate === "")
      return setMessage("Please choose times.");
    if (selectedCounties.length === 0)
      return setMessage("Please choose counties.");
    const selectedCountiesString = selectedCounties.join(",");
    try {
      setMessage("Loading...");
      const response = await fetch(
        baseURL +
          "/inputs?location=" +
          selectedCountiesString +
          "&startTime=" +
          dateRange.startDate +
          "&endTime=" +
          dateRange.endDate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setIsAdmin(false);
        setMessage("Authorization failed. You're session may have expired...");
        return;
      }

      if (!response.ok) {
        setMessage("No data found in those locations and or time period.");
        return;
      }
      const data = await response.json();
      await delay;
      setData(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data:" + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/inputs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have ended."
        );
      }

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete weather input:", await response.json());
      }
      setMessage("Successful deletion!");
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting weather input:", error);
    }
  };

  const onEdit = async (id, updatedValues) => {
    setLoading(true);
    const response = await fetch(`${baseURL}/inputs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedValues),
    });

    if (response.status === 401) {
      setIsAdmin(false);
      return setMessage(
        "Authorization failed. You're session may have expired."
      );
    }

    if (response.ok) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...updatedValues } : item
        )
      );
      setMessage("Successfully edited!");
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      console.error("Failed to update data on the server");
    }
  };

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      setMessage("Loading...");
      const response = await fetch(`${baseURL}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.status === 401) {
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (response.ok) {
        setMessage("Admin created successfully!");
        setShowModal(false);
        setNewAdmin({ email: "", name: "" });
      } else {
        setMessage("Failed to create admin.");
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newPassword,
          isNewAccount: false,
        }),
      });

      if (response.status === 401) {
        setLoading(true);
        setIsAdmin(false);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (response.ok) {
        setLoading(true);
        setMessage("Password updated successfully.");
        setShowChangePasswordModal(false);
      } else {
        setLoading(true);
        setMessage("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch(baseURL + "/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setIsAdmin(false);
        setLoading(true);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (response.ok) {
        const data = await response.json();
        setAdminList(data);
      } else {
        console.error("Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const response = await fetch(`${baseURL}/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setIsAdmin(false);
        setLoading(true);
        return setMessage(
          "Authorization failed. You're session may have expired."
        );
      }

      if (response.ok) {
        // Refresh the admin list after deletion
        setAdminList((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== adminId)
        );
        setMessage("Successfully deleted admin.");
        setLoading(true);
      } else {
        console.error("Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const getAdminList = () => {
    fetchAdmins();
    setShowAdminListModal(true);
  };

  const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 relative w-11/12 max-w-md">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Logo */}
          <div className="flex justify-center items-center pb-6">
            <img
              src={stormcenter_logo}
              alt="Weather"
              className="w-[200px] h-auto"
            />
          </div>

          {/* Content Area */}
          <div className="text-center">{children}</div>
        </div>
      </div>
    );
  };

  if (error) {
    return <div className="text-red-600 text-lg">{error}</div>;
  }

  return (
    <div>
      {isAdmin ? (
        <div className="min-h-screen bg-gray-100 lg:p-8 p-4">
          {admin.isNewAccount && showChangePasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowChangePasswordModal(false)}
              onSave={handlePasswordChange}
            />
          )}
          {admin?.email === "marandoryan@gmail.com" && (
            <div className="flex items-center justify-center mb-2 lg:absolute top-2 right-2 lg:top-4 lg:right-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-600 transition text-sm lg:text-base lg:px-4 lg:py-2 mr-4"
              >
                Create Admin
              </button>
              <button
                onClick={getAdminList}
                className="bg-blue-500 text-white px-2 py-1 rounded-lg shadow-md hover:bg-blue-600 transition text-sm lg:text-base lg:px-4 lg:py-2"
              >
                See List of Admins
              </button>
            </div>
          )}

          {showAdminListModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">List of Admins</h3>
                <ul className="space-y-2">
                  {adminList.map((admin) => (
                    <li
                      key={admin.id}
                      className="flex justify-between items-center"
                    >
                      <span>{admin.name}</span>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowAdminListModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
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
          <div className="flex justify-center items-center pb-4 lg:pb-8">
            <img
              src={stormcenter_logo}
              alt="Weather"
              className="w-[200px] h-auto lg:w-[300px]"
            />
          </div>

          <h1 className="text-2xl font-semibold text-center mb-4 lg:text-4xl lg:mb-6">
            Welcome, {admin.name}
          </h1>

          <div className="mb-6 text-center">
            <button
              onClick={getAllWeatherInput}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition text-sm lg:text-base lg:px-6 lg:py-3 w-full max-w-md mx-auto"
            >
              Get All Data
            </button>
          </div>

          {/* Centered Date Range and County Selector */}
          <div className="flex flex-col gap-4 mb-6 w-full max-w-7xl mx-auto lg:flex-row lg:gap-6">
            <div className="flex-1 p-4 bg-white rounded-lg shadow-md flex flex-col justify-between lg:p-6">
              <div className="mb-4 lg:mb-6">
                <DateMapComponent onDateRangeChange={handleDateRangeChange} />
              </div>
              <button
                onClick={submitDateRangeData}
                className="mt-auto mb-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition w-full text-sm lg:text-base lg:px-6 lg:py-3"
              >
                Get Weather Data For Range Only
              </button>
            </div>

            <div className="flex-1 p-4 bg-white rounded-lg shadow-md flex flex-col justify-between lg:p-6">
              <div className="mb-4 lg:mb-6">
                <h2 className="text-lg font-semibold mb-2 lg:text-xl">
                  Select Counties
                </h2>
                <CountySelector
                  onSelectedCountiesChange={handleSelectedCountiesChange}
                />
              </div>
              <button
                onClick={submitDataLocation}
                className="mt-auto mb-4 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition w-full text-sm lg:text-base lg:px-6 lg:py-3"
              >
                Get Weather Data For Location Only
              </button>
            </div>
          </div>

          <h3 className="text-xl mb-4 text-center">
            Data Query for{" "}
            {selectedCounties.length > 0 &&
              `locations: ${selectedCounties.join(", ")}`}
            {selectedCounties.length > 0 &&
              dateRange.startDate &&
              dateRange.endDate &&
              " during "}
            {dateRange.startDate &&
              dateRange.endDate &&
              `from ${dateRange.startDate} to ${dateRange.endDate}`}
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

          <div className="mt-4 flex flex-col items-center gap-y-4 px-6 lg:flex-row lg:justify-between lg:gap-y-0">
            {data.length > 0 && (
              <>
                <button
                  onClick={sortedWeatherInputs}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                  Sort By Amount
                </button>
                <button
                  onClick={sortedWeatherInputsByDamage}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                  Sort For Damage
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

          <WeatherInputs
            data={data}
            onDelete={handleDelete}
            onEdit={onEdit}
            locationQuery={locationQuery}
            timeStampStartQuery={timeStampStartQuery}
            timeStampEndQuery={timeStampEndQuery}
          />

          <Modal isOpen={loading} onClose={() => setLoading(false)}>
            {/* Animated Weather Icon 1 */}
            <div className="flex justify-center items-center mb-6">
              <ReactAnimatedWeather
                icon={weatherWind.icon}
                color={weatherWind.color}
                size={80} // Reduced size for better fit
                animate={weatherWind.animate}
              />
            </div>
            <p className="mt-4 text-center text-gray-700">{message}</p>
          </Modal>
        </div>
      ) : (
        <LoginPage onSubmit={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
