import { Bell, BrainCircuit, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-[#0B1120] border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <BrainCircuit className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-white text-xl font-bold">OmniMind AI</h1>
          <p className="text-xs text-gray-400">AI Memory Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-gray-300 cursor-pointer hover:text-white" />

        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
          <User className="w-5 h-5 text-cyan-400" />
          <span className="text-white text-sm">Adi</span>
        </div>
      </div>
    </header>
  );
}