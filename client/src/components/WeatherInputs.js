import React, { useState } from "react";

const WeatherInputs = ({
    data,
    onDelete,
    onEdit,
    locationQuery,
    timeStampStartQuery,
    timeStampEndQuery,
}) => {
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
                                {input.location} at{" "}
                                {new Date(input.enteredAt).toLocaleString()}
                            </h3>
                            <p>Reported precipitation: {input.precipTotal}"</p>
                            <p>
                                By: {input.name} / {input.email}
                            </p>
                        </div>
                    )}
                    {input.picturePath && (
                        <div style={styles.mediaContainer}>
                            <img
                                src={input.picturePath}
                                alt={`${input.location} weather`}
                                style={styles.media}
                            />
                        </div>
                    )}
                    {input.videoPath && (
                        <div style={styles.mediaContainer}>
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
    mediaContainer: {
        margin: "10px 0",
    },
    media: {
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
