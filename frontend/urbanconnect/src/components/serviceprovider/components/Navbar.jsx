import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";

export default function Navbar({ setSidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Get page title from route
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/admin" || pathname === "/provider")
      return "Dashboard";
    const parts = pathname.split("/");
    if (parts.length > 1 && parts[1]) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <div className="flex flex-1 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="mr-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="ml-4 flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
            <Bell className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center rounded-full focus:outline-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
                Dr. Jane Smith
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
