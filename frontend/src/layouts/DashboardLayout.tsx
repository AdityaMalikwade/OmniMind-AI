import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}