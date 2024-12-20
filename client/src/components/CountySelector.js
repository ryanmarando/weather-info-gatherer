import React, { useState } from "react";

// List of counties in Southwestern Ohio (you can expand this list if needed)
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
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col space-y-4">
      <label htmlFor="county-select" className="text-lg font-semibold mb-2">
        Select Counties with Control Click:
      </label>
      <select
        id="county-select"
        multiple
        value={selectedCounties}
        onChange={handleSelectChange}
        size={5} // Adjust size of dropdown
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-40"
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
