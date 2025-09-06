import React, { useState } from "react";
import Sidebar from "./Sidebar";

// Update LayoutProps untuk memasukkan onToggleSidebar
interface LayoutProps {
  children: React.ReactNode;
  onToggleSidebar: () => void; // Tambahkan onToggleSidebar ke props
}

const Layout = ({ children, onToggleSidebar }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close state
    onToggleSidebar(); // Notify parent to update sidebar visibility status
  };

  return (
    <div className="flex">
      {/* Sidebar dengan status isSidebarOpen */}
      <Sidebar isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebarToggle} isLoggedIn={true} />

      {/* Main Content */}
      <div
        className="flex-1 p-8 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "80px", // Layout akan menyesuaikan dengan lebar sidebar
          transition: "margin-left 0.3s ease-in-out", // Smooth transition untuk margin
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
