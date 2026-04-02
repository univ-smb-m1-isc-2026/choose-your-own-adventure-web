import { useState, useCallback, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import EdgePanel from "@/components/editor/EdgePanel";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ValidationPanel from "@/components/editor/ValidationPanel";
import { adventureService, type SaveAdventurePayload } from "@/services/adventureService";
import type { EditorNodeData, EditorEdgeData } from "@/types/editor";

const nodeTypes = { chapter: ChapterNode };

let nodeIdCounter = 100;

export default function EditorPage() {
  const { adventureId } = useParams<{ adventureId: string }>();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EditorEdgeData>([]);
  const [selectedNode, setSelectedNode] = useState<Node<EditorNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<EditorEdgeData> | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [adventureTitle, setAdventureTitle] = useState("Mon Aventure");
  const [currentAdventureId, setCurrentAdventureId] = useState<string | undefined>(adventureId);
  const [saving, setSaving] = useState(false);

  // Load existing adventure
  useEffect(() => {
    if (!adventureId) {
      // New adventure - add start node
      const startNode: Node<EditorNodeData> = {
        id: "1",
        type: "chapter",
        position: { x: 300, y: 80 },
        data: {
          label: "Chapitre 1 – Le début",
          content: "Vous vous réveillez dans une forêt sombre...",
          type: "start",
          isEnding: false,
        },
      };
      setNodes([startNode]);
      return;
    }

    Promise.all([
      adventureService.getById(adventureId),
      adventureService.getChapters(adventureId),
    ]).then(([adventure, chapters]) => {
      setAdventureTitle(adventure.title);
      setCurrentAdventureId(adventure.id);

      const loadedNodes: Node<EditorNodeData>[] = chapters.map((ch, i) => ({
        id: ch.id,
        type: "chapter",
        position: { x: ch.positionX || 100 + (i % 3) * 250, y: ch.positionY || 80 + Math.floor(i / 3) * 200 },
        data: {
          label: ch.title,
          content: ch.content || "",
          type: ch.isStart ? "start" : ch.isCombat ? "combat" : ch.isEnding ? "ending" : "normal",
          isEnding: ch.isEnding,
          imageUrl: ch.imageUrl,
          combatEnemyName: ch.combatEnemyName,
          combatEnemyHealth: ch.combatEnemyHealth,
        },
      }));

      const loadedEdges: Edge<EditorEdgeData>[] = [];
      chapters.forEach((ch) => {
        ch.choices?.forEach((choice) => {
          loadedEdges.push({
            id: `e-${ch.id}-${choice.toChapterId}`,
            source: ch.id,
            target: choice.toChapterId,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7c5bf5" },
            style: { stroke: "#7c5bf5", strokeWidth: 2 },
            label: choice.label || "Choix",
            data: {
              label: choice.label || "Choix",
              healthDelta: choice.healthDelta || 0,
              requiresConfirmation: choice.requiresConfirmation || false,
            },
            labelStyle: { fontSize: 11, fill: "#9b9cb5" },
            labelBgStyle: { fill: "#1c1c27", fillOpacity: 0.9 },
          });
        });
      });

      setNodes(loadedNodes);
      setEdges(loadedEdges);
    }).catch(console.error);
  }, [adventureId, setEdges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7c5bf5" },
            style: { stroke: "#7c5bf5", strokeWidth: 2 },
            label: "Choix",
            data: { label: "Choix", healthDelta: 0, requiresConfirmation: false },
            labelStyle: { fontSize: 11, fill: "#9b9cb5" },
            labelBgStyle: { fill: "#1c1c27", fillOpacity: 0.9 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addChapter = () => {
    const id = String(nodeIdCounter++);
    const newNode: Node<EditorNodeData> = {
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

  const onNodeClick = useCallback((_: ReactMouseEvent, node: Node<EditorNodeData>) => {
    setSelectedEdge(null);
    setSelectedNode(node);
  }, []);

  const onEdgeClick = useCallback((_: ReactMouseEvent, edge: Edge<EditorEdgeData>) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
  }, []);

  const updateNodeData = (id: string, data: Partial<EditorNodeData>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
    );
    setSelectedNode((prev) =>
      prev?.id === id ? { ...prev, data: { ...prev.data, ...data } } : prev
    );
  };

  const updateEdgeData = (id: string, data: Partial<EditorEdgeData>) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === id) {
          const newData = { ...e.data, ...data } as EditorEdgeData;
          return { 
            ...e, 
            label: newData.label,
            data: newData 
          };
        }
        return e;
      })
    );
    setSelectedEdge((prev) =>
      prev?.id === id ? { ...prev, label: data.label || prev.label, data: { ...prev.data, ...data } as EditorEdgeData } : prev
    );
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  };

  const handleSave = async (): Promise<string | undefined> => {
    setSaving(true);
    try {
      const payload: SaveAdventurePayload = {
        title: adventureTitle,
        summary: "",
        language: "fr",
        difficulty: "MEDIUM",
        allowBacktrack: true,
        tags: [],
        chapters: nodes.map((n) => ({
          tempId: n.id,
          title: n.data.label,
          content: n.data.content,
          imageUrl: n.data.imageUrl || null,
          type: n.data.type,
          isEnding: n.data.isEnding,
          positionX: Math.round(n.position.x),
          positionY: Math.round(n.position.y),
          combatEnemyName: n.data.combatEnemyName,
          combatEnemyHealth: n.data.combatEnemyHealth,
        })),
        edges: edges.map((e) => ({
          sourceId: e.source,
          targetId: e.target,
          label: (e.data?.label as string) || "Choix",
          healthDelta: e.data?.healthDelta,
          requiresConfirmation: e.data?.requiresConfirmation,
        })),
      };

      const result = await adventureService.saveComplete(payload, currentAdventureId);
      setCurrentAdventureId(result.id);

      // Reload to get proper UUIDs
      const chapters = await adventureService.getChapters(result.id);
      const loadedNodes: Node<EditorNodeData>[] = chapters.map((ch, i) => ({
        id: ch.id,
        type: "chapter" as const,
        position: { x: ch.positionX || 100 + (i % 3) * 250, y: ch.positionY || 80 + Math.floor(i / 3) * 200 },
        data: {
          label: ch.title,
          content: ch.content || "",
          type: ch.isStart ? "start" : ch.isCombat ? "combat" : ch.isEnding ? "ending" : "normal",
          isEnding: ch.isEnding,
          imageUrl: ch.imageUrl,
          combatEnemyName: ch.combatEnemyName,
          combatEnemyHealth: ch.combatEnemyHealth,
        },
      }));
      const loadedEdges: Edge<EditorEdgeData>[] = [];
      chapters.forEach((ch) => {
        ch.choices?.forEach((choice) => {
          loadedEdges.push({
            id: `e-${ch.id}-${choice.toChapterId}`,
            source: ch.id,
            target: choice.toChapterId,
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7c5bf5" },
            style: { stroke: "#7c5bf5", strokeWidth: 2 },
            label: choice.label || "Choix",
            data: {
              label: choice.label || "Choix",
              healthDelta: choice.healthDelta || 0,
              requiresConfirmation: choice.requiresConfirmation || false,
            },
            labelStyle: { fontSize: 11, fill: "#9b9cb5" },
            labelBgStyle: { fill: "#1c1c27", fillOpacity: 0.9 },
          });
        });
      });
      setNodes(loadedNodes);
      setEdges(loadedEdges);

      // Update URL
      if (!adventureId) {
        navigate(`/editor/${result.id}`, { replace: true });
      }
      return result.id;
    } catch (e) {
      console.error("Save error:", e);
      alert("Erreur lors de la sauvegarde");
      return undefined;
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const adventureIdToPublish = currentAdventureId ?? await handleSave();
    if (!adventureIdToPublish) {
      return;
    }

    try {
      await adventureService.publish(adventureIdToPublish);
      alert("Aventure publiée !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la publication");
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0f0f13' }}>
      <EditorToolbar
        title={adventureTitle}
        onTitleChange={setAdventureTitle}
        onAddChapter={addChapter}
        onDeleteSelected={deleteSelected}
        hasSelection={!!selectedNode}
        onValidate={() => setShowValidation(true)}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onSave={handleSave}
        onPublish={handlePublish}
        saving={saving}
        onBack={() => navigate('/dashboard')}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={() => {
              setSelectedNode(null);
              setSelectedEdge(null);
            }}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
            style={{ background: '#0f0f13' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#252533"
            />
            <Controls className="!bg-[#1c1c27] !border-[#252533] !rounded-lg !shadow-lg [&>button]:!bg-[#1c1c27] [&>button]:!border-[#252533] [&>button]:!fill-[#9b9cb5] [&>button:hover]:!bg-[#252533]" />
            <MiniMap
              nodeColor={(n) =>
                n.data.type === "start"
                  ? "#7c5bf5"
                  : n.data.isEnding
                    ? "#34d399"
                    : "#6b6c85"
              }
              className="!bg-[#1c1c27] !border-[#252533] !rounded-lg !shadow-lg"
              maskColor="rgba(15,15,19,0.7)"
            />
            <Panel position="bottom-left">
              <div className="text-xs px-3 py-1.5 rounded-full border" style={{ color: '#6b6c85', background: 'rgba(28,28,39,0.9)', borderColor: '#252533' }}>
                Glissez pour connecter • Cliquez pour éditer • Suppr pour effacer
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && (
          <ChapterPanel
            key={selectedNode.id}
            node={selectedNode}
            onUpdate={(data) => updateNodeData(selectedNode.id, data)}
            onClose={() => setSelectedNode(null)}
            onDelete={deleteSelected}
          />
        )}

        {selectedEdge && (
          <EdgePanel
            key={selectedEdge.id}
            edge={selectedEdge}
            onUpdate={(data) => updateEdgeData(selectedEdge.id, data)}
            onClose={() => setSelectedEdge(null)}
            onDelete={deleteSelected}
          />
        )}
      </div>

      {showValidation && (
        <ValidationPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowValidation(false)}
          onPublish={handlePublish}
        />
      )}
    </div>
  );
}
