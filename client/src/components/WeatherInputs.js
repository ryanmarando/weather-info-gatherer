import React, { useState } from "react";

const WeatherInputs = ({ data, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null); // Tracks which item is being edited
  const [editValues, setEditValues] = useState({}); // Stores temporary input values during editing

  const handleEditClick = (input) => {
    setEditingId(input.id);
    setEditValues({
      location: input.location,
      precipTotal: input.precipTotal,
      name: input.name,
      email: input.email,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e, id) => {
    if (e.key === "Enter") {
      await onEdit(id, editValues); // Call the edit function
      setEditingId(null); // Exit editing mode
    }
  };

  return (
    <div style={styles.gridContainer}>
      {data.map((input) => (
        <div key={input.id} style={styles.box}>
          {editingId === input.id ? (
            <div style={styles.info}>
              <input
                name="location"
                value={editValues.location}
                onChange={handleInputChange}
                onKeyDown={(e) => handleEditSubmit(e, input.id)}
                style={styles.input}
              />
              <input
                name="precipTotal"
                value={editValues.precipTotal}
                onChange={handleInputChange}
                onKeyDown={(e) => handleEditSubmit(e, input.id)}
                style={styles.input}
              />
              <input
                name="name"
                value={editValues.name}
                onChange={handleInputChange}
                onKeyDown={(e) => handleEditSubmit(e, input.id)}
                style={styles.input}
              />
              <input
                name="email"
                value={editValues.email}
                onChange={handleInputChange}
                onKeyDown={(e) => handleEditSubmit(e, input.id)}
                style={styles.input}
              />
            </div>
          ) : (
            <div style={styles.info}>
              <h3>
                {input.location} at {new Date(input.enteredAt).toLocaleString()}
              </h3>
              <p>Reported precipitation: {input.precipTotal}"</p>
              <p>
                By: {input.name} / {input.email}
              </p>
            </div>
          )}
          {input.picture && (
            <div style={styles.imageContainer}>
              <img
                src={input.picture}
                alt={`${input.location} weather`}
                style={styles.image}
              />
            </div>
          )}
          <button
            style={styles.editButton}
            onClick={() => handleEditClick(input)}
          >
            {editingId === input.id ? "Editing..." : "Edit"}
          </button>
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
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  box: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  info: {
    marginBottom: "10px",
  },
  imageContainer: {
    margin: "10px 0",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
  },
  input: {
    margin: "5px 0",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    marginTop: "10px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default WeatherInputs;
