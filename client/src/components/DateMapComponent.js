import React, { useState, useEffect } from "react";

const DateMapComponent = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");

  // Effect hook to set startDate to today’s date when the component mounts
  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);

    const formatted = `${today.getFullYear()}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;
    setFormattedStartDate(formatted);
    setFormattedEndDate(formatted);
  }, []);

  // Function to handle start date selection
  const handleStartDateChange = (event) => {
    const inputDate = event.target.value;
    const date = new Date(inputDate + "T00:00:00");
    const formatted = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    setStartDate(date);
    setFormattedStartDate(formatted);

    // Adjust end date if it's not valid (end date before start date)
    if (endDate && endDate < date) {
      const newEndDate = new Date(date);
      newEndDate.setDate(date.getDate() + 1); // Add 1 day
      setEndDate(newEndDate);

      const formattedEnd = `${newEndDate.getFullYear()}/${String(
        newEndDate.getMonth() + 1
      ).padStart(2, "0")}/${String(newEndDate.getDate()).padStart(2, "0")}`;
      setFormattedEndDate(formattedEnd);
    }

    // Inform the parent of the new start date and end date
    onDateRangeChange(formatted, formattedEndDate);
  };

  // Function to handle end date selection
  const handleEndDateChange = (event) => {
    const inputDate = event.target.value;
    const date = new Date(inputDate + "T00:00:00");
    const formatted = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    // Check if the end date is before the start date, and adjust accordingly
    if (startDate && date < startDate) {
      alert(
        "End date cannot be before the start date! Automatically setting end date to one day after the start date."
      );
      const newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + 1); // Add 1 day
      setEndDate(newEndDate);
      setFormattedEndDate(
        `${newEndDate.getFullYear()}/${String(
          newEndDate.getMonth() + 1
        ).padStart(2, "0")}/${String(newEndDate.getDate()).padStart(2, "0")}`
      );
    } else {
      setEndDate(date);
      setFormattedEndDate(formatted);
    }

    // Inform the parent of the new start date and end date
    onDateRangeChange(formattedStartDate, formatted);
  };

  return (
    <div>
      <h1>Select Date Range</h1>

      <label>
        Start Date:
        <input
          type="date"
          onChange={handleStartDateChange}
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
        />
      </label>

      <label>
        End Date:
        <input
          type="date"
          onChange={handleEndDateChange}
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
        />
      </label>

      <div>
        {formattedStartDate && formattedEndDate && (
          <h3>
            Selected Date Range: {formattedStartDate} to {formattedEndDate}
          </h3>
        )}
      </div>
    </div>
  );
};

export default DateMapComponent;
