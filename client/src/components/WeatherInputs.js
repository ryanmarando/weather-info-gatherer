import React, { useState } from "react";

const WeatherInputs = ({ data, onDelete, onEdit }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const handleEditClick = (input) => {
        if (editingId === input.id) {
            // Submit the changes
            handleEditSubmit(input.id);
        } else {
            // Enter edit mode
            setEditingId(input.id);
            setEditValues({
                location: input.location,
                city: input.city,
                precipTotal: input.precipTotal,
                name: input.name,
                email: input.email,
                showsDamage: input.showsDamage,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEditSubmit = async (id) => {
        await onEdit(id, editValues);
        data.map((item) =>
            item.id === id ? { ...item, ...editValues } : item
        );
        setEditingId(null);
        setEditValues({});
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
                                style={styles.input}
                                placeholder="Location"
                            />
                            <input
                                name="city"
                                value={editValues.city}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="City"
                            />
                            <input
                                name="precipTotal"
                                value={editValues.precipTotal}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Precipitation Total"
                            />
                            <input
                                name="name"
                                value={editValues.name}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Name"
                            />
                            <input
                                name="email"
                                value={editValues.email}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Email"
                            />
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="showsDamage"
                                    checked={editValues.showsDamage || false}
                                    onChange={handleInputChange}
                                    style={styles.checkbox}
                                />
                                Shows Damage
                            </label>
                        </div>
                    ) : (
                        <div style={styles.info}>
                            <h3 style={styles.title}>
                                {input.location}, {input.city}{" "}
                                <p style={styles.date}>
                                    {new Date(input.enteredAt).toLocaleString()}
                                </p>
                            </h3>
                            <p style={styles.text}>
                                Reported precipitation: {input.precipTotal}"
                            </p>
                            <p style={styles.text}>
                                By: {input.name} / {input.email}
                            </p>
                            <p style={styles.text}>
                                Shows Damage: {input.showsDamage ? "Yes" : "No"}
                            </p>
                        </div>
                    )}
                    <div style={styles.mediaContainer}>
                        {input.picturePath && (
                            <img
                                src={input.picturePath}
                                alt={`${input.location} weather`}
                                style={styles.media}
                            />
                        )}
                        {input.videoPath && (
                            <video
                                controls
                                style={styles.media}
                                src={input.videoPath} // S3 URL for video
                                poster="https://via.placeholder.com/300x200.png?text=Loading+Video..."
                                onError={() =>
                                    console.error(
                                        `Error loading video: ${input.videoPath}`
                                    )
                                }
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                    <div style={styles.actions}>
                        <button
                            style={styles.editButton}
                            onClick={() => handleEditClick(input)}
                        >
                            {editingId === input.id ? "Submit" : "Edit"}
                        </button>
                        <button
                            style={styles.deleteButton}
                            onClick={() => onDelete(input.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Makes it responsive
        gap: "20px",
        padding: "20px",
        justifyItems: "center",
    },
    box: {
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        minWidth: "250px",
        maxWidth: "350px",
        display: "flex",
        flexDirection: "column", // Stack content vertically
        alignItems: "center", // Center content horizontally
        overflow: "hidden", // Prevent overflow of content
    },
    info: {
        marginBottom: "15px",
        textAlign: "left", // Align text to the left for better readability
        width: "100%",
    },
    title: {
        fontSize: "1.25rem",
        fontWeight: "600",
        marginBottom: "10px",
    },
    date: {
        fontSize: "0.875rem",
        color: "#555",
        fontWeight: "400",
    },
    text: {
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#333",
        margin: "5px 0",
    },
    input: {
        margin: "5px 0",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
        fontSize: "1rem",
        backgroundColor: "#f9f9f9",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        fontSize: "1rem",
    },
    checkbox: {
        marginRight: "10px",
    },
    mediaContainer: {
        marginTop: "15px",
        display: "flex",
        flexDirection: "column", // Ensure media elements stack vertically
        alignItems: "center", // Center the media elements
        width: "100%", // Ensure the media container takes up the full width of the box
    },
    media: {
        width: "100%", // Ensure the media element doesn't extend outside
        maxWidth: "300px", // Limit the max width of media elements
        height: "auto",
        borderRadius: "5px",
        marginBottom: "10px", // Add spacing between media elements
    },
    actions: {
        marginTop: "10px",
    },
    editButton: {
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "10px 15px",
        cursor: "pointer",
        marginRight: "10px",
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "10px 15px",
        cursor: "pointer",
    },
};

export default WeatherInputs;
