import {
  FileText,
  Image,
  FileCode,
  Trash2,
  Download,
  Sparkles,
} from "lucide-react";

interface DocumentCardProps {
  title: string;
  type: "pdf" | "image" | "code" | "docx";
  size: string;
}

export default function DocumentCard({
  title,
  type,
  size,
}: DocumentCardProps) {

  const icon = () => {
    switch (type) {
      case "image":
        return <Image className="text-pink-400 w-8 h-8" />;

      case "code":
        return <FileCode className="text-green-400 w-8 h-8" />;

      default:
        return <FileText className="text-red-400 w-8 h-8" />;
    }
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-cyan-500 transition">

      <div className="flex justify-between items-start">

        <div className="flex gap-4">

          <div>{icon()}</div>

          <div>

            <h2 className="text-white font-semibold">
              {title}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {size}
            </p>

          </div>

        </div>

      </div>

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl py-2 flex justify-center items-center gap-2 text-white">
          <Sparkles size={18}/>
          AI Summary
        </button>

        <button className="bg-white/10 p-3 rounded-xl hover:bg-white/20">
          <Download size={18}/>
        </button>

        <button className="bg-red-500/20 text-red-400 p-3 rounded-xl hover:bg-red-500/30">
          <Trash2 size={18}/>
        </button>

      </div>

    </div>
  );
}