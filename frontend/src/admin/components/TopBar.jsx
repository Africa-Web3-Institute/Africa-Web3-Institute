import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function TopBar({ pageTitle }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const {logout}=useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };


  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">
            {pageTitle}
          </h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-700 rounded-lg px-3 py-2 border border-gray-600 focus-within:border-blue-500 transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-gray-200 text-sm ml-2 w-48 placeholder-gray-400"
            />
          </div>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-800"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                AD
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-300">
                Admin
              </span>
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2 border-t border-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2 border border-gray-600">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-gray-200 text-sm ml-2 w-full placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}