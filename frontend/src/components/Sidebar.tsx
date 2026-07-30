import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Search", icon: Search, path: "/search" },
  { name: "Upload", icon: Upload, path: "/upload" },
  { name: "AI Chat", icon: MessageSquare, path: "/dashboard" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0B1120] border-r border-white/10 p-5">
      <h2 className="text-white text-2xl font-bold mb-8">OmniMind</h2>

      <nav className="space-y-2">
        {menus.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button className="flex items-center gap-3 mt-10 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}