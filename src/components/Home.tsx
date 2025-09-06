import React, { ReactNode } from "react";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

const Home = () => {
  const Link = ({ to, children, className }: LinkProps) => (
    <a href={to} className={className}>
      {children}
    </a>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Header Component - Placeholder */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-lg font-semibold">Header Component</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to the Admin Dashboard
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Manage all aspects of the YukMariProject here. From program management to transaction tracking, it's all in your hands.
            </p>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* About Us Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">About Us</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">Learn more about our mission and vision</p>
            <Link to="/aboutus" className="block">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>

          {/* Programs Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Programs</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">Track and manage community programs</p>
            <Link to="/programs" className="block">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Manage Programs
              </button>
            </Link>
          </div>

          {/* Transactions Card */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-purple-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Transactions</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">View and manage all transactions</p>
            <Link to="/transactions" className="block">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                View Transactions
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Actions Section */}
        {/* ... (bagian ini tidak berubah dan tetap seperti sebelumnya) */}
      </div>
    </div>
  );
};

export default Home;
