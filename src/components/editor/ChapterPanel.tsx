import { useState, useEffect } from "react";
import type { Node } from "reactflow";
import { X, Trash2, BookOpen, Swords, Flag, Play } from "lucide-react";

interface ChapterPanelProps {
  node: Node;
  onUpdate: (data: Partial<any>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const typeOptions = [
  { value: "start", label: "Départ", icon: Play, color: "text-indigo-600" },
  { value: "normal", label: "Chapitre", icon: BookOpen, color: "text-slate-600" },
  { value: "combat", label: "Combat", icon: Swords, color: "text-rose-600" },
  { value: "ending", label: "Fin", icon: Flag, color: "text-emerald-600" },
];

export default function ChapterPanel({ node, onUpdate, onClose, onDelete }: ChapterPanelProps) {
  const [label, setLabel] = useState(node.data.label || "");
  const [content, setContent] = useState(node.data.content || "");
  const [type, setType] = useState(node.data.isEnding ? "ending" : node.data.type || "normal");
  const [allowBacktrack, setAllowBacktrack] = useState(node.data.allowBacktrack ?? true);
  const [imageUrl, setImageUrl] = useState(node.data.imageUrl || "");

  useEffect(() => {
    setLabel(node.data.label || "");
    setContent(node.data.content || "");
    setType(node.data.isEnding ? "ending" : node.data.type || "normal");
    setAllowBacktrack(node.data.allowBacktrack ?? true);
    setImageUrl(node.data.imageUrl || "");
  }, [node.id]);

  const handleSave = () => {
    onUpdate({
      label,
      content,
      type: type === "ending" ? "normal" : type,
      isEnding: type === "ending",
      allowBacktrack,
      imageUrl,
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-100 flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">Éditer le chapitre</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Type selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Type de nœud
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                    type === opt.value
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={13} className={type === opt.value ? "text-indigo-500" : opt.color} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Titre
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nom du chapitre..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-800 placeholder-gray-300 transition-all"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Contenu narratif
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Le texte affiché au joueur lorsqu'il arrive sur ce chapitre..."
            rows={6}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-800 placeholder-gray-300 transition-all resize-none leading-relaxed"
          />
          <p className="text-[10px] text-gray-400 mt-1">{content.length} caractères</p>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Image (URL optionnelle)
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-800 placeholder-gray-300 transition-all"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="mt-2 w-full h-24 object-cover rounded-lg border border-gray-200"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
        </div>

        {/* Options */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Options
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setAllowBacktrack(!allowBacktrack)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                allowBacktrack ? "bg-indigo-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  allowBacktrack ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800">
              Autoriser le retour en arrière
            </span>
          </label>
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>ID du nœud</span>
            <span className="font-mono text-gray-500">{node.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Position</span>
            <span className="font-mono text-gray-500">
              {Math.round(node.position.x)}, {Math.round(node.position.y)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
        >
          <Trash2 size={13} />
          Supprimer
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
