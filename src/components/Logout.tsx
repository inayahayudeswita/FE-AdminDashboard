import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  // Close the logout confirmation modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    logout();
    navigate("/login");
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Logout Button */}
      <button
        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        onClick={handleLogoutClick}
      >
        Logout
      </button>

      {/* Confirmation modal for logout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-sm animate-scale-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Apakah Anda Yakin Ingin Logout?
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={handleConfirmLogout}
                className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Lanjut
              </button>
              <button
                onClick={handleModalClose}
                className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;