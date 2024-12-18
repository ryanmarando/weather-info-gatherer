import React, { useState } from "react";

// List of counties in Southwestern Ohio (you can expand this list if needed)
const counties = [
  "Mercer",
  "Adams",
  "Brown",
  "Butler",
  "Clermont",
  "Clinton",
  "Hamilton",
  "Highland",
  "Miami",
  "Montgomery",
  "Preble",
  "Warren",
  "Clark",
  "Darke",
  "Greene",
  "Pickaway",
];

const CountySelector = ({ onSelectedCountiesChange }) => {
  const [selectedCounties, setSelectedCounties] = useState([]);

  // Handle change in selected counties
  const handleSelectChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCounties(selectedOptions);
    // Pass the selected counties list to the parent component
    onSelectedCountiesChange(selectedOptions);
  };

  return (
    <div>
      <label htmlFor="county-select">Select Counties with Control Click:</label>
      <select
        id="county-select"
        multiple
        value={selectedCounties}
        onChange={handleSelectChange}
        size={5} // Adjust size of dropdown
        style={{ width: "300px", height: "150px" }} // Style for multi-select
      >
        {counties.map((county, index) => (
          <option key={index} value={county}>
            {county}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountySelector;
