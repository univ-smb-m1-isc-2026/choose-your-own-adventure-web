import { useState } from "react";
import { Plus, Trash2, CheckCircle, Save, ChevronLeft, Layers, Loader2, Send } from "lucide-react";

interface EditorToolbarProps {
  title: string;
  onTitleChange: (v: string) => void;
  onAddChapter: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onValidate: () => void;
  nodeCount: number;
  edgeCount: number;
  onSave?: () => void;
  onPublish?: () => void;
  saving?: boolean;
  onBack?: () => void;
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
  onSave,
  onPublish,
  saving,
  onBack,
}: EditorToolbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <div className="h-14 flex items-center px-4 gap-3 z-10" style={{
      background: '#16161d',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
    }}>
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 transition-colors text-sm mr-1" style={{ color: '#6b6c85' }}>
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Aventures</span>
      </button>

      <div className="w-px h-5" style={{ background: '#252533' }} />

      {/* Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Layers size={16} style={{ color: '#7c5bf5' }} className="shrink-0" />
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            className="text-sm font-semibold bg-transparent focus:outline-none min-w-0 max-w-xs"
            style={{ color: '#ecedf2', borderBottom: '1px solid #7c5bf5' }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold transition-colors truncate"
            style={{ color: '#ecedf2' }}
          >
            {title}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-3 text-xs px-3 py-1.5 rounded-full"
        style={{ color: '#6b6c85', background: '#1c1c27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span>{nodeCount} nœud{nodeCount !== 1 ? "s" : ""}</span>
        <span style={{ color: '#252533' }}>•</span>
        <span>{edgeCount} lien{edgeCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onAddChapter}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #7c5bf5, #9b7bf7)' }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Chapitre</span>
        </button>

        {hasSelection && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg transition-colors"
            style={{ color: '#f87171' }}
          >
            <Trash2 size={14} />
          </button>
        )}

        <div className="w-px h-5 mx-0.5" style={{ background: '#252533' }} />

        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg transition-colors"
          style={{ color: '#9b9cb5' }}
        >
          <CheckCircle size={14} />
          <span className="hidden sm:inline">Valider</span>
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
          style={{ color: '#ecedf2', background: '#252533', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span className="hidden sm:inline">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #34d399, #6ee7b7)', color: '#0f0f13' }}
        >
          <Send size={14} />
          <span className="hidden sm:inline">Publier</span>
        </button>
      </div>
    </div>
  );
}
