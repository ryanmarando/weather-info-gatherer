import React from "react";

const WeatherInputs = ({ data, onDelete }) => {
  return (
    <div>
      {data.map((input) => (
        <div key={input.id} style={styles.container}>
          <div>
            <h3>
              {input.location} at {input.enteredAt}
            </h3>
            <p>Reported precipitation: {input.precipTotal}"</p>
            <p>
              By: {input.name} / {input.email}
            </p>
          </div>
          <button
            style={styles.deleteButton}
            onClick={() => onDelete(input.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default WeatherInputs;
