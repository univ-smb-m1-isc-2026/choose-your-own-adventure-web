import { useState } from "react";
import type { Node } from "reactflow";
import { X, Trash2, BookOpen, Swords, Flag, Play, Heart } from "lucide-react";
import type { EditorNodeData, EditorChapterType } from "@/types/editor";

interface ChapterPanelProps {
  node: Node<EditorNodeData>;
  onUpdate: (data: Partial<EditorNodeData>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const typeOptions: Array<{ value: EditorChapterType; label: string; icon: typeof Play }> = [
  { value: "start", label: "Départ", icon: Play },
  { value: "normal", label: "Chapitre", icon: BookOpen },
  { value: "combat", label: "Combat", icon: Swords },
  { value: "ending", label: "Fin", icon: Flag },
];

export default function ChapterPanel({ node, onUpdate, onClose, onDelete }: ChapterPanelProps) {
  const [label, setLabel] = useState(node.data.label || "");
  const [content, setContent] = useState(node.data.content || "");
  const [type, setType] = useState<EditorChapterType>(node.data.isEnding ? "ending" : node.data.type || "normal");
  const allowBacktrack = node.data.allowBacktrack ?? true;
  const [imageUrl, setImageUrl] = useState(node.data.imageUrl || "");
  const [combatEnemyName, setCombatEnemyName] = useState(node.data.combatEnemyName || "L'Ennemi");
  const [combatEnemyHealth, setCombatEnemyHealth] = useState(node.data.combatEnemyHealth || 50);

  const handleSave = () => {
    onUpdate({
      label, content,
      type: type === "ending" ? "normal" : type,
      isEnding: type === "ending",
      allowBacktrack, imageUrl,
      combatEnemyName: type === "combat" ? combatEnemyName : undefined,
      combatEnemyHealth: type === "combat" ? combatEnemyHealth : undefined,
    });
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: '0.875rem',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
    background: '#16161d', color: '#ecedf2', outline: 'none',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  return (
    <div style={{ width: 320, background: '#1c1c27', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ecedf2' }}>Éditer le chapitre</span>
        <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6c85', borderRadius: 6 }}>
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Type de nœud
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = type === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8,
                    fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.15s',
                    border: isActive ? '1px solid #7c5bf5' : '1px solid rgba(255,255,255,0.06)',
                    background: isActive ? 'rgba(124,91,245,0.1)' : 'transparent',
                    color: isActive ? '#a78bfa' : '#9b9cb5',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon size={13} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Titre
          </label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nom du chapitre..." style={inputStyle} />
        </div>

        {/* Content */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Contenu narratif
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Le texte affiché au joueur..."
            rows={6}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
          />
          <p style={{ fontSize: 10, color: '#6b6c85', marginTop: 4 }}>{content.length} caractères</p>
        </div>

        {/* Image */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Image (URL)
          </label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
        </div>

        {/* Combat Stats */}
        {type === "combat" && (
          <div style={{ padding: '12px', background: 'rgba(248, 113, 113, 0.04)', border: '1px solid rgba(248, 113, 113, 0.1)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Swords size={14} /> Stats du combat
            </span>
            <div>
              <label style={{ display: 'block', fontSize: '0.625rem', color: '#6b6c85', marginBottom: 4 }}>Nom de l'ennemi</label>
              <input 
                value={combatEnemyName} 
                onChange={(e) => setCombatEnemyName(e.target.value)} 
                placeholder="Ex: Gardien de la crypte" 
                style={{ ...inputStyle, background: 'rgba(0,0,0,0.2)' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.625rem', color: '#6b6c85', marginBottom: 4 }}>Points de vie (PV)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={14} color="#f87171" style={{ flexShrink: 0 }} />
                <input 
                  type="number" 
                  value={combatEnemyHealth} 
                  onChange={(e) => setCombatEnemyHealth(parseInt(e.target.value) || 0)}
                  style={{ ...inputStyle, background: 'rgba(0,0,0,0.2)' }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div style={{ background: '#16161d', borderRadius: 8, padding: '10px 12px', fontSize: '0.75rem', color: '#6b6c85' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>ID</span><span style={{ fontFamily: 'monospace', color: '#9b9cb5' }}>{node.id.substring(0, 8)}...</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Position</span><span style={{ fontFamily: 'monospace', color: '#9b9cb5' }}>{Math.round(node.position.x)}, {Math.round(node.position.y)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
        <button onClick={onDelete} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', fontSize: '0.875rem',
          color: '#f87171', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer'
        }}>
          <Trash2 size={13} /> Supprimer
        </button>
        <button onClick={handleSave} style={{
          flex: 1, padding: '8px 12px', fontSize: '0.875rem', fontWeight: 600,
          background: 'linear-gradient(135deg, #7c5bf5, #9b7bf7)', color: 'white',
          border: 'none', borderRadius: 8, cursor: 'pointer'
        }}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
