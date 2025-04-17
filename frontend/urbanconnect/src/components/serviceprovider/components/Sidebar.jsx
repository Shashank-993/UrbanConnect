import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  X,
  Menu,
  Clock,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    { name: "Dashboard", href: "/provider", icon: LayoutDashboard },
    { name: "Appointments", href: "/provider/appointments", icon: Calendar },
    { name: "Services", href: "/provider/services", icon: Wrench },
    { name: "Clients", href: "/provider/clients", icon: Users },
    { name: "Schedule", href: "/provider/schedule", icon: Clock },
    { name: "Payments", href: "/provider/payments", icon: CreditCard },
    { name: "Settings", href: "/provider/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar for desktop and mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between bg-gray-900 px-4">
          <span className="text-xl font-semibold text-white">
            Provider Panel
          </span>
          <button
            className="text-gray-400 hover:text-white md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto py-4">
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button at bottom */}
          <div className="px-2">
            <button className="group flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
              <LogOut className="mr-3 h-6 w-6 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
