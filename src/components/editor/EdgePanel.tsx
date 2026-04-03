import { useState, useEffect, useRef } from "react";
import { X, Trash2, Heart, CheckCircle2 } from "lucide-react";
import type { Edge } from "reactflow";
import type { EditorEdgeData } from "@/types/editor";

interface EdgePanelProps {
  edge: Edge<EditorEdgeData>;
  onUpdate: (data: Partial<EditorEdgeData>) => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function EdgePanel({ edge, onUpdate, onClose, onDelete }: EdgePanelProps) {
  const [label, setLabel] = useState(edge.data?.label || "");
  const [healthDelta, setHealthDelta] = useState(edge.data?.healthDelta || 0);
  const [requiresConfirmation, setRequiresConfirmation] = useState(edge.data?.requiresConfirmation || false);

  const skipInitial = useRef(true);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onUpdate({
        label: label || "Choix",
        healthDelta,
        requiresConfirmation,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [label, healthDelta, requiresConfirmation, onUpdate]);

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
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ecedf2' }}>Éditer le choix</span>
        <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6c85', borderRadius: 6 }}>
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Label */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Texte du choix
          </label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex: Entrer dans la grotte..." style={inputStyle} />
        </div>

        {/* Health Delta */}
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6b6c85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Impact sur la santé (HP)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', 
              background: healthDelta > 0 ? 'rgba(52, 211, 153, 0.1)' : healthDelta < 0 ? 'rgba(248, 113, 113, 0.1)' : 'rgba(255,255,255,0.04)',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', flex: 1
            }}>
              <Heart size={14} color={healthDelta > 0 ? '#34d399' : healthDelta < 0 ? '#f87171' : '#6b6c85'} fill={healthDelta !== 0 ? 'currentColor' : 'none'} />
              <input 
                type="number" 
                value={healthDelta} 
                onChange={(e) => setHealthDelta(parseInt(e.target.value) || 0)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ecedf2', fontSize: '0.875rem', width: '100%' }}
              />
            </div>
          </div>
          <p style={{ fontSize: 10, color: '#6b6c85', marginTop: 6 }}>
            Positif pour soigner, négatif pour blesser. 0 pour aucun effet.
          </p>
        </div>

        {/* Confirmation */}
        <div 
          onClick={() => setRequiresConfirmation(!requiresConfirmation)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px', 
            background: 'rgba(255,255,255,0.03)', borderRadius: 8, cursor: 'pointer',
            border: requiresConfirmation ? '1px solid rgba(124, 91, 245, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ 
            width: 18, height: 18, borderRadius: 4, border: '2px solid #7c5bf5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: requiresConfirmation ? '#7c5bf5' : 'transparent',
            color: 'white'
          }}>
            {requiresConfirmation && <CheckCircle2 size={12} strokeWidth={3} />}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#ecedf2' }}>Confirmation requise</span>
            <span style={{ display: 'block', fontSize: '0.6875rem', color: '#6b6c85' }}>Demande au joueur de valider son choix</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
        <button onClick={onDelete} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', fontSize: '0.875rem',
          color: '#f87171', background: 'rgba(248, 113, 113, 0.05)', border: '1px solid rgba(248, 113, 113, 0.1)', borderRadius: 8, cursor: 'pointer'
        }}>
          <Trash2 size={13} /> Supprimer le choix
        </button>
      </div>
    </div>
  );
}
