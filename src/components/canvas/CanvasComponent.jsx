import React, { useState, useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import Toolbar from "./Toolbar";
import PropertyPanel from "./PropertyPanel";
import { nodeTypes } from "./CustomNodes";
import CodeModal from "../UI/CodeModal";
import { nodesToHtml } from "../../utils/codegen";

const defaultNodeStyles = {
  rectangle: { fill: "#4f46e5", stroke: "#4338ca", width: 120, height: 80 },
  circle: { fill: "#4f46e5", stroke: "#4338ca", width: 100, height: 100 },
  text: { fontSize: 16, color: "#1f2937", width: 150, height: 40 },
  image: { width: 150, height: 150 },
  header: { width: "100%", height: 60, fill: "#ffffff", stroke: "#e5e7eb" },
  loginForm: { width: 320, height: 400, fill: "#ffffff", stroke: "#e5e7eb" },
  button: { width: 120, height: 40, fill: "#3b82f6", stroke: "#2563eb" },
};

const CanvasComponent = ({
  canvaId,
  initialNodes = [],
  initialEdges = [],
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCode, setShowCode] = useState(false);
  const [generated, setGenerated] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);
  const [tool, setTool] = useState("select");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleShowCode = () => {
    const fullPage = nodesToHtml(nodes);
    setGenerated(fullPage);
    setShowCode(true);
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge({ ...params, animated: true }, eds);
        onSave(nodes, newEdges);
        return newEdges;
      });
    },
    [nodes, onSave]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const newSelected = selectedNodes[0] || selectedEdges[0] || null;
      if (
        !newSelected ||
        !selectedElement ||
        newSelected.id !== selectedElement.id
      ) {
        setSelectedElement(newSelected);
      }
    },
    [selectedElement]
  );

  const handleElementChange = useCallback(
    (updated) => {
      setNodes((ns) => {
        const newNodes = ns.map((n) => (n.id === updated.id ? updated : n));
        onSave(newNodes, edges);
        return newNodes;
      });
      setSelectedElement(updated);
    },
    [edges, onSave]
  );

  const handleAddNode = useCallback(
    (type, position) => {
      if (!nodeTypes[type]) return;
      const id = `${type}-${Date.now()}`;

      const baseData = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        style: defaultNodeStyles[type],
        visible: true,
        locked: false,
      };

      const extra =
        type === "text"
          ? { text: "New text" }
          : type === "image"
          ? { src: "/placeholder.png" }
          : type === "header"
          ? {
              logo: "/logo-placeholder.png",
              navItems: ["Home", "About", "Contact"],
            }
          : type === "loginForm"
          ? {
              title: "Login",
              showLogo: true,
              fields: [
                {
                  label: "Email",
                  type: "email",
                  placeholder: "Enter your email",
                },
                {
                  label: "Password",
                  type: "password",
                  placeholder: "Enter password",
                },
              ],
              buttonText: "Sign In",
              buttonColor: "#3b82f6",
            }
          : type === "button"
          ? { text: "Click me", onClick: "handleClick" }
          : {};

      const newNode = { id, type, position, data: { ...baseData, ...extra } };

      setNodes((ns) => {
        const updated = [...ns, newNode];
        onSave(updated, edges);
        return updated;
      });
    },
    [edges, onSave]
  );

  const handleDeleteElement = useCallback(() => {
    if (!selectedElement) return;

    setNodes((ns) => {
      const updatedNodes = ns.filter((n) => n.id !== selectedElement.id);
      setEdges((es) =>
        es.filter(
          (e) =>
            e.id !== selectedElement.id &&
            e.source !== selectedElement.id &&
            e.target !== selectedElement.id
        )
      );
      onSave(updatedNodes, edges);
      return updatedNodes;
    });
    setSelectedElement(null);
  }, [selectedElement, edges, onSave]);

  const handleDuplicateElement = useCallback(() => {
    if (!selectedElement || !reactFlowInstance) return;
    const newNode = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      position: {
        x: selectedElement.position.x + 20,
        y: selectedElement.position.y + 20,
      },
    };
    setNodes((ns) => {
      const updated = [...ns, newNode];
      onSave(updated, edges);
      return updated;
    });
    setSelectedElement(newNode);
  }, [selectedElement, edges, onSave, reactFlowInstance]);

  const handleToggleVisibility = (nodeId) =>
    setNodes((ns) => {
      const updated = ns.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, visible: !n.data.visible } }
          : n
      );
      onSave(updated, edges);
      return updated;
    });

  const handleToggleLock = (nodeId) =>
    setNodes((ns) => {
      const updated = ns.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: { ...n.data, locked: !n.data.locked },
              draggable: !n.data.locked,
            }
          : n
      );
      onSave(updated, edges);
      return updated;
    });

  const handleAlign = (direction) => {
    if (!selectedElement) return;
    const selectedNodes = nodes.filter(
      (n) => n.selected || n.id === selectedElement.id
    );
    const minX = Math.min(...selectedNodes.map((n) => n.position.x));
    const maxX = Math.max(...selectedNodes.map((n) => n.position.x + n.width));
    const centerX = (minX + maxX) / 2;

    setNodes((ns) =>
      ns.map((n) => {
        if (!selectedNodes.some((sn) => sn.id === n.id)) return n;
        return {
          ...n,
          position: {
            x:
              direction === "left"
                ? minX
                : direction === "right"
                ? maxX - n.width
                : centerX - n.width / 2,
            y: n.position.y,
          },
        };
      })
    );
  };

  const handleReorder = useCallback(
    (from, to) => {
      if (from < 0 || to < 0) return;
      setNodes((ns) => {
        const draft = [...ns];
        const [moved] = draft.splice(from, 1);
        draft.splice(to, 0, moved);
        onSave(draft, edges);
        return draft;
      });
    },
    [edges, onSave]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!reactFlowInstance) return;
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      handleAddNode(type, position);
    },
    [reactFlowInstance, handleAddNode]
  );

  const flowProps = useMemo(
    () => ({
      nodes,
      edges,
      nodeTypes,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onInit: setReactFlowInstance,
      onSelectionChange,
      onNodeDragStop: () => onSave(nodes, edges),
      onMove: (_, vp) => setViewport(vp),
      onDragOver,
      onDrop,
      fitView: true,
      snapToGrid: true,
      snapGrid: [10, 10],
      nodesDraggable: !selectedElement?.data?.locked,
      proOptions: { hideAttribution: true },
    }),
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onSelectionChange,
      onSave,
      onDragOver,
      onDrop,
      selectedElement,
    ]
  );

  return (
    <div className="flex flex-1 h-full bg-gray-50">
      {/* Toolbar lateral */}
      <Toolbar
        activeTool={tool}
        onToolChange={setTool}
        onAddNode={handleAddNode}
        flowInstance={reactFlowInstance}
        selectedElement={selectedElement}
        onDelete={handleDeleteElement}
        onCopy={handleDuplicateElement}
        onAlign={handleAlign}
        onToggleVisibility={handleToggleVisibility}
        onToggleLock={handleToggleLock}
        onShowCode={handleShowCode}
        onBringToFront={() =>
          handleReorder(
            nodes.findIndex((n) => n.id === selectedElement?.id),
            0
          )
        }
        onSendToBack={() =>
          handleReorder(
            nodes.findIndex((n) => n.id === selectedElement?.id),
            nodes.length - 1
          )
        }
        onSave={() => onSave(nodes, edges)}
      />

      {showCode && (
        <CodeModal
          code={generated}
          nodes={nodes}
          onClose={() => setShowCode(false)}
        />
      )}

      {/* Lienzo */}
      <div className="flex-1 relative">
        <ReactFlow {...flowProps}>
          <Background gap={16} color="#e5e7eb" variant="dots" />
          <Controls
            position="bottom-right"
            showInteractive={false}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "4px",
            }}
          />
          <MiniMap
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "8px",
            }}
            nodeColor={(n) => {
              if (n.type === "rectangle") return "#4f46e5";
              if (n.type === "circle") return "#4f46e5";
              if (n.type === "text") return "#1f2937";
              return "#9ca3af";
            }}
          />
          <Panel position="top-right">
            <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm text-xs text-gray-600">
              Canvas: {canvaId} • Nodos: {nodes.length} • Zoom:{" "}
              {Math.round(viewport.zoom * 100)}%
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Panel de propiedades */}
      <PropertyPanel
        selectedElement={selectedElement}
        onChange={handleElementChange}
      />
    </div>
  );
};

export default React.memo(CanvasComponent);
