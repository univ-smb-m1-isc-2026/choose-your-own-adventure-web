import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";

type ChapterType = "start" | "normal" | "combat" | "ending";

interface ChapterData {
  label: string;
  content: string;
  type: ChapterType;
  isEnding: boolean;
}

const typeConfig: Record<ChapterType, { color: string; bg: string; badge: string; dot: string }> = {
  start: {
    color: "border-indigo-400",
    bg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-400",
  },
  normal: {
    color: "border-slate-200",
    bg: "bg-white",
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  combat: {
    color: "border-rose-300",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-400",
  },
  ending: {
    color: "border-emerald-300",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
  },
};

const typeLabels: Record<ChapterType, string> = {
  start: "Départ",
  normal: "Chapitre",
  combat: "Combat",
  ending: "Fin",
};

export default function ChapterNode({ data, selected }: NodeProps<ChapterData>) {
  const nodeType: ChapterType = data.isEnding ? "ending" : (data.type as ChapterType) || "normal";
  const cfg = typeConfig[nodeType];

  return (
    <div
      className={`
        w-56 rounded-xl border-2 shadow-sm transition-all duration-150
        ${cfg.color} ${cfg.bg}
        ${selected ? "shadow-lg ring-2 ring-indigo-300 ring-offset-1" : "hover:shadow-md"}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-white !bg-slate-400"
      />

      <div className="px-3 py-2.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${cfg.badge}`}>
            {typeLabels[nodeType]}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {data.label || "Sans titre"}
        </p>

        {/* Preview */}
        {data.content && (
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {data.content}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-white !bg-indigo-400"
      />
    </div>
  );
}
