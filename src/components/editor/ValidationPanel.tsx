import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface ValidationPanelProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
  onPublish?: () => void;
}

interface ValidationIssue {
  level: "error" | "warning" | "info";
  message: string;
}

function validateGraph(nodes: Node[], edges: Edge[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const startNodes = nodes.filter((n) => n.data.type === "start");
  if (startNodes.length === 0) {
    issues.push({ level: "error", message: "Aucun nœud de départ défini." });
  } else if (startNodes.length > 1) {
    issues.push({ level: "error", message: `Plusieurs nœuds de départ (${startNodes.length}).` });
  }

  const endingNodes = nodes.filter((n) => n.data.isEnding);
  if (endingNodes.length === 0) {
    issues.push({ level: "error", message: "Aucun nœud de fin défini." });
  }

  const sourceIds = new Set(edges.map((e) => e.source));
  const deadEnds = nodes.filter((n) => !n.data.isEnding && !sourceIds.has(n.id));
  deadEnds.forEach((n) => {
    issues.push({ level: "error", message: `Impasse : "${n.data.label}" n'a pas de choix et n'est pas une fin.` });
  });

  if (startNodes.length === 1) {
    const reachable = new Set<string>();
    const queue = [startNodes[0].id];
    while (queue.length) {
      const cur = queue.shift()!;
      if (reachable.has(cur)) continue;
      reachable.add(cur);
      edges.filter((e) => e.source === cur).forEach((e) => queue.push(e.target));
    }
    nodes.forEach((n) => {
      if (!reachable.has(n.id)) {
        issues.push({ level: "warning", message: `Nœud inaccessible : "${n.data.label}"` });
      }
    });
  }

  if (nodes.length === 0) {
    issues.push({ level: "info", message: "L'aventure est vide." });
  }

  if (issues.filter((i) => i.level === "error").length === 0 && nodes.length > 0) {
    issues.push({ level: "info", message: `Graphe valide : ${nodes.length} chapitres, ${edges.length} liens.` });
  }

  return issues;
}

const levelConfig = {
  error: { icon: XCircle, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
  warning: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.15)' },
  info: { icon: Info, color: '#7c5bf5', bg: 'rgba(124,91,245,0.08)', border: 'rgba(124,91,245,0.15)' },
};

export default function ValidationPanel({ nodes, edges, onClose, onPublish }: ValidationPanelProps) {
  const issues = useMemo(() => validateGraph(nodes, edges), [nodes, edges]);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.filter((i) => i.level === "warning").length;
  const isValid = errors === 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div style={{ background: '#1c1c27', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isValid ? <CheckCircle size={18} color="#34d399" /> : <XCircle size={18} color="#f87171" />}
            <span style={{ fontWeight: 700, color: '#ecedf2' }}>Validation</span>
          </div>
          <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b6c85' }}>
            <X size={16} />
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: 16, padding: '12px 20px', background: '#16161d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f87171' }}>{errors}</div>
            <div style={{ fontSize: '0.6875rem', color: '#6b6c85' }}>erreur{errors !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fbbf24' }}>{warnings}</div>
            <div style={{ fontSize: '0.6875rem', color: '#6b6c85' }}>avert.</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isValid ? '#34d399' : '#f87171' }}>
              {isValid ? "✓ Prête" : "× Corrections"}
            </span>
          </div>
        </div>

        {/* Issues */}
        <div style={{ padding: '16px 20px', maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {issues.map((issue, i) => {
            const cfg = levelConfig[issue.level];
            const Icon = cfg.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <Icon size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.8125rem', color: '#ecedf2', lineHeight: 1.4 }}>{issue.message}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', fontSize: '0.875rem', fontWeight: 500, color: '#9b9cb5', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Fermer
          </button>
          {isValid && onPublish && (
            <button onClick={onPublish} style={{ padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(135deg, #34d399, #6ee7b7)', color: '#0f0f13', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Publier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
