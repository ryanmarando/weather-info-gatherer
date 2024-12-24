import React, { useState } from "react";

const ChangePasswordModal = ({ onClose, onSave }) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    if (newPassword.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    onSave(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Change Your Password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
