import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface ValidationPanelProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

interface ValidationIssue {
  level: "error" | "warning" | "info";
  message: string;
}

function validateGraph(nodes: Node[], edges: Edge[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. Check for a start node
  const startNodes = nodes.filter((n) => n.data.type === "start");
  if (startNodes.length === 0) {
    issues.push({ level: "error", message: "Aucun nœud de départ défini." });
  } else if (startNodes.length > 1) {
    issues.push({ level: "error", message: `Plusieurs nœuds de départ (${startNodes.length}). Il doit y en avoir exactement un.` });
  }

  // 2. Check for at least one ending
  const endingNodes = nodes.filter((n) => n.data.isEnding);
  if (endingNodes.length === 0) {
    issues.push({ level: "error", message: "Aucun nœud de fin défini. Ajoutez au moins une fin." });
  }

  // 3. Dead ends (non-ending nodes with no outgoing edges)
  const sourceIds = new Set(edges.map((e) => e.source));
  const deadEnds = nodes.filter((n) => !n.data.isEnding && !sourceIds.has(n.id));
  if (deadEnds.length > 0) {
    deadEnds.forEach((n) => {
      issues.push({ level: "error", message: `Impasse : "${n.data.label}" n'a pas de choix et n'est pas une fin.` });
    });
  }

  // 4. Unreachable nodes (not reachable from start)
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const reachable = new Set<string>();
    const queue = [startId];
    while (queue.length) {
      const cur = queue.shift()!;
      if (reachable.has(cur)) continue;
      reachable.add(cur);
      edges.filter((e) => e.source === cur).forEach((e) => queue.push(e.target));
    }
    nodes.forEach((n) => {
      if (!reachable.has(n.id)) {
        issues.push({ level: "warning", message: `Nœud inaccessible : "${n.data.label}" n'est pas atteignable depuis le départ.` });
      }
    });
  }

  // 5. Info: isolated nodes
  if (nodes.length === 0) {
    issues.push({ level: "info", message: "L'aventure est vide. Ajoutez des chapitres pour commencer." });
  }

  // All good bonus
  if (issues.filter((i) => i.level === "error").length === 0 && nodes.length > 0) {
    issues.push({ level: "info", message: `Graphe valide : ${nodes.length} chapitres, ${edges.length} liens.` });
  }

  return issues;
}

const levelConfig = {
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100", label: "Erreur" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Avertissement" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "Info" },
};

export default function ValidationPanel({ nodes, edges, onClose }: ValidationPanelProps) {
  const issues = useMemo(() => validateGraph(nodes, edges), [nodes, edges]);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.filter((i) => i.level === "warning").length;
  const isValid = errors === 0;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {isValid ? (
              <CheckCircle size={18} className="text-emerald-500" />
            ) : (
              <XCircle size={18} className="text-red-500" />
            )}
            <span className="font-semibold text-gray-800">Validation du graphe</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary */}
        <div className="flex gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">{errors}</div>
            <div className="text-xs text-gray-400">erreur{errors !== 1 ? "s" : ""}</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-lg font-bold text-amber-500">{warnings}</div>
            <div className="text-xs text-gray-400">avertissement{warnings !== 1 ? "s" : ""}</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 flex items-center">
            <span className={`text-sm font-medium ${isValid ? "text-emerald-600" : "text-red-600"}`}>
              {isValid ? "✓ Prête à publier" : "× Corrections requises"}
            </span>
          </div>
        </div>

        {/* Issues list */}
        <div className="px-5 py-4 space-y-2 max-h-80 overflow-y-auto">
          {issues.map((issue, i) => {
            const cfg = levelConfig[issue.level];
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}
              >
                <Icon size={14} className={`${cfg.color} mt-0.5 shrink-0`} />
                <p className="text-sm text-gray-700 leading-snug">{issue.message}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Fermer
          </button>
          {isValid && (
            <button className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors active:scale-[0.98]">
              Publier l'aventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
