import React, { useState } from "react";
import DateMapComponent from "./components/DateMapComponent";
import CountySelector from "./components/CountySelector";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedCounties, setSelectedCounties] = useState([]);
  const baseURL = "http://localhost:3000";

  const getAllWeatherInput = async () => {
    try {
      const response = await fetch(baseURL + "/getAllWeatherInputs");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Error fetching data:" + error.message);
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

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

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
    // http://localhost:3000/getWeatherInput?location=Mercer,Greene&startTime=2024-12-12&endTime=2024-12-19
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Admin User Viewer Weather Data Collector</h1>
      <div>
        <button onClick={getAllWeatherInput}>Get All Data</button>
      </div>
      <div>
        <DateMapComponent onDateRangeChange={handleDateRangeChange} />
        <button onClick={submitDateRangeData}>
          Get Weather Data For Range Only
        </button>
      </div>
      <div>
        <CountySelector
          onSelectedCountiesChange={handleSelectedCountiesChange}
        />
        <button onClick={submitDataLocation}>
          Get Weather Data For Location Only
        </button>
      </div>
      <div>
        <button onClick={submitDataLocationAndTime}>
          Get Weather Data For Selected Location and Dates
        </button>
      </div>
      <h3>
        Showing Data for locations {selectedCounties} during{" "}
        {dateRange.startDate} to {dateRange.endDate}
      </h3>
      {data.map((input) => {
        return (
          <div key={input.id}>
            <h3>
              {input.location} at {input.enteredAt}
            </h3>
            <p>Reported precipitation: {input.precipTotal}"</p>
            <p>
              By: {input.name} / {input.email}
            </p>
          </div>
        );
      })}
      <div>
        {data.length === 0 ? (
          <></>
        ) : (
          <div>
            <button onClick={sortedWeatherInputs}>Sort By Amount</button>
            <button onClick={clearAllWeatherInputs}>Clear Data</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
