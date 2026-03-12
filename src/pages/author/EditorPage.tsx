import { useState, useCallback, useRef } from "react";
import type { Node, Edge, Connection } from "reactflow";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import ChapterNode from "@/components/editor/ChapterNode";
import ChapterPanel from "@/components/editor/ChapterPanel";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ValidationPanel from "@/components/editor/ValidationPanel";

const nodeTypes = { chapter: ChapterNode };

const initialNodes: Node[] = [
  {
    id: "1",
    type: "chapter",
    position: { x: 300, y: 80 },
    data: {
      label: "Chapitre 1 – Le début",
      content: "Vous vous réveillez dans une forêt sombre...",
      type: "start",
      isEnding: false,
    },
  },
];

const initialEdges: Edge[] = [];

let nodeIdCounter = 2;

export default function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [adventureTitle, setAdventureTitle] = useState("Mon Aventure");

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
            style: { stroke: "#6366f1", strokeWidth: 2 },
            label: "Choix",
            labelStyle: { fontSize: 11, fill: "#6b7280" },
            labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addChapter = () => {
    const id = String(nodeIdCounter++);
    const newNode: Node = {
      id,
      type: "chapter",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 200 },
      data: {
        label: `Chapitre ${id}`,
        content: "",
        type: "normal",
        isEnding: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
    );
    setSelectedNode((prev) =>
      prev?.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev
    );
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top bar */}
      <EditorToolbar
        title={adventureTitle}
        onTitleChange={setAdventureTitle}
        onAddChapter={addChapter}
        onDeleteSelected={deleteSelected}
        hasSelection={!!selectedNode}
        onValidate={() => setShowValidation(true)}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
            className="bg-gray-50"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#e5e7eb"
            />
            <Controls className="shadow-sm border border-gray-200 rounded-lg overflow-hidden" />
            <MiniMap
              nodeColor={(n) =>
                n.data.type === "start"
                  ? "#6366f1"
                  : n.data.isEnding
                  ? "#10b981"
                  : "#94a3b8"
              }
              className="border border-gray-200 rounded-lg shadow-sm"
            />
            <Panel position="bottom-left">
              <div className="text-xs text-gray-400 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200">
                Glissez pour connecter • Double-clic pour éditer • Suppr pour effacer
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Side panel */}
        {selectedNode && (
          <ChapterPanel
            node={selectedNode}
            onUpdate={(data) => updateNodeData(selectedNode.id, data)}
            onClose={() => setSelectedNode(null)}
            onDelete={deleteSelected}
          />
        )}
      </div>

      {/* Validation modal */}
      {showValidation && (
        <ValidationPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}
