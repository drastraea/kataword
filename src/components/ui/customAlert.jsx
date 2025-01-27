import React from "react";

export const CustomAlert = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <p className="text-center text-sm">{message}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};