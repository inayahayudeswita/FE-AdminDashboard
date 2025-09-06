import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  List,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Image,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isLoggedIn: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  isLoggedIn,
}) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!isLoggedIn) return null;

  const menuItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      path: "/home",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "aboutus",
      icon: Info,
      label: "About Us",
      path: "/aboutus",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "imageslider",
      icon: Image,
      label: "Image Slider",
      path: "/imageslider",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "programs",
      icon: List,
      label: "Programs",
      path: "/programs",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "partners",
      icon: Users,
      label: "Partners",
      path: "/partners",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "transactions",
      icon: CreditCard,
      label: "Transactions",
      path: "/transaksi",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/settings",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout(); // Pastikan ini async jika panggil API
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 bottom-0 transition-all duration-500 ease-in-out backdrop-blur-sm border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo & Toggle */}
        <div className="relative p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FundUnity
                  </h1>
                  <p className="text-xs text-slate-400">CMS Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 transition"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map(({ id, icon: IconComponent, label, path, color }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `group relative flex items-center py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${color} shadow-lg shadow-blue-500/25 text-white scale-105`
                    : "hover:bg-slate-700/50 text-slate-300 hover:text-white hover:scale-105"
                }`
              }
              onMouseEnter={() => setHoveredLink(id)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  hoveredLink === id ? "bg-white/10" : ""
                }`}
              >
                <IconComponent size={18} className="text-inherit" />
              </div>
              {isSidebarOpen && (
                <span className="relative z-10 ml-4 font-medium">{label}</span>
              )}
              {!isSidebarOpen && hoveredLink === id && (
                <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 z-50 whitespace-nowrap">
                  {label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogoutClick}
            className="group relative flex items-center py-3 px-4 w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105"
            onMouseEnter={() => setHoveredLink("logout")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition">
              <LogOut size={18} className="text-white" />
            </div>
            {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
            {!isSidebarOpen && hoveredLink === "logout" && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 z-50 whitespace-nowrap">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <LogOut size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Konfirmasi Logout</h2>
                  <p className="text-sm text-gray-500">Anda yakin ingin keluar dari sistem?</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Semua sesi akan berakhir dan Anda perlu login kembali untuk mengakses dashboard.
              </p>
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  onClick={handleCancelLogout}
                >
                  Batal
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                  onClick={handleConfirmLogout}
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

