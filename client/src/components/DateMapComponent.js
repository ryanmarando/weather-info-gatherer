import React, { useState, useEffect } from "react";

const DateMapComponent = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");

  const formatDate = (date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    setStartDate(today);
    setEndDate(tomorrow);

    const formattedStart = formatDate(today);
    const formattedEnd = formatDate(tomorrow);

    setFormattedStartDate(formattedStart);
    setFormattedEndDate(formattedEnd);

    // Inform the parent of the initial date range
    onDateRangeChange(formattedStart, formattedEnd);
  }, [onDateRangeChange]); // Add onDateRangeChange here

  // Function to handle start date selection
  const handleStartDateChange = (event) => {
    const inputDate = event.target.value;
    const date = new Date(inputDate + "T00:00:00");

    const formatted = formatDate(date);

    setStartDate(date);
    setFormattedStartDate(formatted);

    // Adjust end date if it's before the new start date
    if (endDate && endDate < date) {
      const newEndDate = new Date(date);
      newEndDate.setDate(date.getDate() + 1);
      setEndDate(newEndDate);

      const formattedEnd = formatDate(newEndDate);
      setFormattedEndDate(formattedEnd);

      // Inform the parent of the updated date range
      if (onDateRangeChange) {
        onDateRangeChange(formatted, formattedEnd);
      }
    } else {
      // Inform the parent of the updated start date
      if (onDateRangeChange) {
        onDateRangeChange(formatted, formattedEndDate);
      }
    }
  };

  // Function to handle end date selection
  const handleEndDateChange = (event) => {
    const inputDate = event.target.value;
    const date = new Date(inputDate + "T00:00:00");

    if (startDate && date < startDate) {
      alert(
        "End date cannot be before the start date! Automatically setting end date to one day after the start date."
      );
      const newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + 1);
      setEndDate(newEndDate);

      const formattedEnd = formatDate(newEndDate);
      setFormattedEndDate(formattedEnd);

      // Inform the parent of the adjusted date range
      if (onDateRangeChange) {
        onDateRangeChange(formattedStartDate, formattedEnd);
      }
    } else {
      setEndDate(date);
      const formatted = formatDate(date);
      setFormattedEndDate(formatted);

      // Inform the parent of the updated end date
      if (onDateRangeChange) {
        onDateRangeChange(formattedStartDate, formatted);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col space-y-4">
      <h1 className="text-xl font-semibold">Select Date Range</h1>

      <div className="flex flex-col space-y-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Start Date:</span>
          <input
            type="date"
            onChange={handleStartDateChange}
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            className="mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">End Date:</span>
          <input
            type="date"
            onChange={handleEndDateChange}
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            className="mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {formattedStartDate && formattedEndDate && (
        <h3 className="text-sm text-gray-700">
          Selected Date Range: {formattedStartDate} to {formattedEndDate}
        </h3>
      )}
    </div>
  );
};

export default DateMapComponent;
