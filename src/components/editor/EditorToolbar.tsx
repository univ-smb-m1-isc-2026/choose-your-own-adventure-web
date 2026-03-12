import { useState } from "react";
import { Plus, Trash2, CheckCircle, Save, Eye, ChevronLeft, Layers } from "lucide-react";

interface EditorToolbarProps {
  title: string;
  onTitleChange: (v: string) => void;
  onAddChapter: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onValidate: () => void;
  nodeCount: number;
  edgeCount: number;
}

export default function EditorToolbar({
  title,
  onTitleChange,
  onAddChapter,
  onDeleteSelected,
  hasSelection,
  onValidate,
  nodeCount,
  edgeCount,
}: EditorToolbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shadow-sm z-10">
      {/* Back */}
      <button className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-sm mr-1">
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Aventures</span>
      </button>

      <div className="w-px h-5 bg-gray-200" />

      {/* Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Layers size={16} className="text-indigo-400 shrink-0" />
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            className="text-sm font-semibold text-gray-800 bg-transparent border-b border-indigo-300 focus:outline-none min-w-0 max-w-xs"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors truncate"
          >
            {title}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-3 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
        <span>{nodeCount} nœud{nodeCount !== 1 ? "s" : ""}</span>
        <span className="text-gray-200">•</span>
        <span>{edgeCount} lien{edgeCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onAddChapter}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Chapitre</span>
        </button>

        {hasSelection && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 size={14} />
          </button>
        )}

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Eye size={14} />
          <span className="hidden sm:inline">Aperçu</span>
        </button>

        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CheckCircle size={14} />
          <span className="hidden sm:inline">Valider</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all">
          <Save size={14} />
          <span className="hidden sm:inline">Publier</span>
        </button>
      </div>
    </div>
  );
}
