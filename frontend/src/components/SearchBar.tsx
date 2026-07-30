import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="w-full flex items-center bg-[#111827] border border-white/10 rounded-2xl px-5 py-4">

      <Search className="text-gray-400 w-5 h-5" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search PDFs, Images, DOCX, PPT, Code..."
        className="bg-transparent outline-none px-4 w-full text-white placeholder:text-gray-500"
      />

      <button
        onClick={onSearch}
        className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-white transition"
      >
        Search
      </button>

    </div>
  );
}