import React from 'react';

export const GovHeader: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top micro-bar */}
      <div className="w-full bg-[#162e5b] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>भारत सरकार</span>
            <span className="text-[#a0aec0]">|</span>
            <span>Government of India</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <a href="#main-content" className="hover:underline">Skip to main content</a>
            <span>|</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main branding bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          {/* Logo container */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-blue-50 rounded flex items-center justify-center font-bold text-[#162e5b] border border-blue-100">
              MSME
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#162e5b] leading-tight tracking-tight">
                UDYAM REGISTRATION
              </h1>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Ministry of Micro, Small & Medium Enterprises
              </p>
            </div>
          </div>
        </div>

        {/* Support info */}
        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600 font-medium">
          <div className="text-right hidden md:block">
            <span className="block text-gray-400 font-bold uppercase text-[10px]">Helpline</span>
            <span className="font-bold text-[#162e5b]">champions@gov.in</span>
          </div>
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Official Portal
          </div>
        </div>
      </div>

      {/* Blue dense nav bar */}
      <div className="w-full bg-[#1e3a8a] text-white py-2 px-4 shadow-inner text-sm font-semibold">
        <div className="max-w-7xl mx-auto flex space-x-6">
          <span className="border-b-2 border-orange-400 pb-0.5 cursor-pointer">Home</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">NIC Code</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">Useful Documents</span>
          <span className="opacity-80 hover:opacity-100 cursor-pointer">Print/Verify</span>
        </div>
      </div>
    </header>
  );
};
