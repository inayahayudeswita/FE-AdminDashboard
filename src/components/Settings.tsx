import React, { useState } from "react";
import {
  Mail,
  Lock,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Header from "../layout/Header";

const Settings = () => {
  const [email, setEmail] = useState("yukmari@gmail.com");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleEmailChange = () => {
    if (newEmail === "") {
      setEmailError("Email baru tidak boleh kosong.");
      return;
    }
    if (!newEmail.includes("@")) {
      setEmailError("Format email tidak valid.");
      return;
    }
    setEmail(newEmail);
    setNewEmail("");
    setEmailError("");
    setSuccessMessage("Email berhasil diubah.");
    setShowEmailForm(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handlePasswordChange = () => {
    if (newPassword === "" || newPasswordConfirm === "") {
      setPasswordError("Password baru dan konfirmasi password harus diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }
    setPassword(newPassword);
    setNewPassword("");
    setNewPasswordConfirm("");
    setPasswordError("");
    setSuccessMessage("Password berhasil diubah.");
    setShowPasswordForm(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50">
      <Header />

      <div className="flex-1 p-8 overflow-auto">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-pink-600 via-blue-600 to-purple-700 p-8 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Pengaturan Akun
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Kelola informasi akun dan keamanan Anda dengan mudah dan aman.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 animate-fade-in">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 border-b border-pink-600/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Email Settings</h2>
                  <p className="text-pink-100 text-sm">Kelola alamat email Anda</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Saat Ini
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-pink-600" />
                  </div>
                  <span className="text-gray-800 font-medium">{email}</span>
                </div>
              </div>

              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-pink-500/25 hover:scale-105"
                >
                  <Mail size={18} />
                  <span className="font-semibold">Ganti Email</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Baru
                    </label>
                    <input
                      type="email"
                      placeholder="Masukkan email baru..."
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {emailError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} />
                      <span>{emailError}</span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleEmailChange}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 font-semibold"
                    >
                      <Save size={16} />
                      <span>Simpan</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowEmailForm(false);
                        setEmailError("");
                        setNewEmail("");
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-semibold"
                    >
                      <X size={16} />
                      <span>Batal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 border-b border-purple-600/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Password Settings</h2>
                  <p className="text-purple-100 text-sm">Kelola keamanan akun Anda</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield size={18} className="text-purple-600" />
                  </div>
                  <span className="text-gray-800 font-medium">Password Tersimpan Aman</span>
                </div>
              </div>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                >
                  <Lock size={18} />
                  <span className="font-semibold">Ganti Kata Sandi</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan password baru..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      placeholder="Konfirmasi password baru..."
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {passwordError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle size={16} />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold"
                    >
                      <Save size={16} />
                      <span>Simpan</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordError("");
                        setNewPassword("");
                        setNewPasswordConfirm("");
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-semibold"
                    >
                      <X size={16} />
                      <span>Batal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;
