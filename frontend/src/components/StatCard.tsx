import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-cyan-400",
}: StatCardProps) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300 hover:scale-[1.02]">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center">
          <Icon className={`w-8 h-8 ${color}`} />
        </div>

      </div>

    </div>
  );
}