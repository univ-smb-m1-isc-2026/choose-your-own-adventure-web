import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { EditorNodeData, EditorChapterType } from "@/types/editor";

const typeConfig: Record<EditorChapterType, { border: string; bg: string; badgeBg: string; badgeText: string; dot: string }> = {
  start: { border: '#7c5bf5', bg: 'rgba(124,91,245,0.08)', badgeBg: 'rgba(124,91,245,0.15)', badgeText: '#a78bfa', dot: '#7c5bf5' },
  normal: { border: '#252533', bg: '#1c1c27', badgeBg: 'rgba(255,255,255,0.06)', badgeText: '#6b6c85', dot: '#6b6c85' },
  combat: { border: '#f87171', bg: 'rgba(248,113,113,0.06)', badgeBg: 'rgba(248,113,113,0.12)', badgeText: '#fca5a5', dot: '#f87171' },
  ending: { border: '#34d399', bg: 'rgba(52,211,153,0.06)', badgeBg: 'rgba(52,211,153,0.12)', badgeText: '#6ee7b7', dot: '#34d399' },
};

const typeLabels: Record<EditorChapterType, string> = {
  start: "Départ",
  normal: "Chapitre",
  combat: "Combat",
  ending: "Fin",
};

export default function ChapterNode({ data, selected }: NodeProps<EditorNodeData>) {
  const nodeType: EditorChapterType = data.isEnding ? "ending" : data.type || "normal";
  const cfg = typeConfig[nodeType];

  return (
    <div
      style={{
        width: '224px',
        borderRadius: '12px',
        border: `2px solid ${selected ? '#7c5bf5' : cfg.border}`,
        background: cfg.bg,
        boxShadow: selected ? '0 0 20px rgba(124,91,245,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ width: 12, height: 12, border: '2px solid #16161d', background: '#6b6c85' }}
      />

      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: cfg.badgeBg, color: cfg.badgeText,
          }}>
            {typeLabels[nodeType]}
          </span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
        </div>

        <p style={{ fontSize: 14, fontWeight: 700, color: '#ecedf2', lineHeight: 1.3, marginBottom: 2 }}>
          {data.label || "Sans titre"}
        </p>

        {data.content && (
          <p style={{ fontSize: 11, color: '#6b6c85', marginTop: 4, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {data.content}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ width: 12, height: 12, border: '2px solid #16161d', background: '#7c5bf5' }}
      />
    </div>
  );
}
