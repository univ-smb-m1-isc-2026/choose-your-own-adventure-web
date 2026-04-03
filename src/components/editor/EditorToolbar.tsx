import { useState } from "react";
import { Plus, Trash2, CheckCircle, Save, ChevronLeft, Layers, Loader2, Send, Tag as TagIcon, X } from "lucide-react";

interface EditorToolbarProps {
  title: string;
  onTitleChange: (v: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
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
  imageUrl?: string;
  onImageUrlChange?: (v: string) => void;
}

export default function EditorToolbar({
  title,
  onTitleChange,
  tags,
  onTagsChange,
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
  imageUrl,
  onImageUrlChange,
}: EditorToolbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="h-14 flex items-center px-4 gap-3 z-10" style={{
      background: '#16161d',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
    }}>
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 transition-colors text-sm mr-1" style={{ color: '#6b6c85' }}>
        <ChevronLeft size={16} />
        <span className="hidden lg:inline">Aventures</span>
      </button>

      <div className="w-px h-5" style={{ background: '#252533' }} />

      {/* Title */}
      <div className="flex items-center gap-2 min-w-[150px] max-w-[250px]">
        <Layers size={16} style={{ color: '#7c5bf5' }} className="shrink-0" />
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            className="text-sm font-semibold bg-transparent focus:outline-none w-full"
            style={{ color: '#ecedf2', borderBottom: '1px solid #7c5bf5' }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold transition-colors truncate w-full text-left"
            style={{ color: '#ecedf2' }}
          >
            {title}
          </button>
        )}
      </div>

      <div className="w-px h-5" style={{ background: '#252533' }} />

      {/* Tags - Dynamic & Responsive */}
      <div className="hidden xl:flex items-center gap-2 flex-1 min-w-0">
        <TagIcon size={14} style={{ color: '#6b6c85' }} />
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border transition-all hover:border-violet-500/50"
              style={{ 
                background: 'rgba(124, 91, 245, 0.05)', 
                borderColor: 'rgba(124, 91, 245, 0.2)',
                color: '#9b7bf7'
              }}
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-400 focus:outline-none">
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Ajouter un tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            onBlur={addTag}
            className="bg-transparent text-[11px] focus:outline-none min-w-[100px]"
            style={{ color: '#9b9cb5' }}
          />
        </div>
      </div>

      <div className="xl:hidden flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#1c1c27]" style={{ color: '#6b6c85' }}>
        <TagIcon size={12} />
        <span>{tags.length}</span>
      </div>

      <div className="w-px h-5 mx-0.5" style={{ background: '#252533' }} />
      
      {/* Image URL */}
      <div className="hidden lg:flex items-center gap-2 max-w-[200px]">
        <Plus size={14} style={{ color: '#6b6c85' }} />
        <input
          type="text"
          placeholder="Image de couverture (URL)"
          value={imageUrl || ''}
          onChange={(e) => onImageUrlChange?.(e.target.value)}
          className="text-[11px] bg-transparent focus:outline-none w-full"
          style={{ color: '#ecedf2' }}
        />
      </div>

      <div className="hidden lg:block w-px h-5 mx-0.5" style={{ background: '#252533' }} />

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
