import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  ArrowLeft,
  Grid,
  Layers,
  Settings,
  Maximize2,
  Minimize2,
} from "react-feather";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorMessage from "../components/UI/ErrorMessage";
import CanvasComponent from "../components/canvas/CanvasComponent";
import useCanvasData from "../hooks/useCanvasData";
import UsersPanel from "../components/canvas/UsersPanel";
import PagesPanel from "../components/canvas/PagesPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import LayoutPresets from "../components/canvas/LayoutPresets";
import LayersPanel from "../components/canvas/LayersPanel";

const CanvaPage = () => {
  const { canvaId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [activeRightPanel, setActiveRightPanel] = useState("pages");
  const [fullScreen, setFullScreen] = useState(false);

  const {
    pages,
    activePage,
    setActivePage,
    nodes,
    edges,
    loading,
    error,
    collaborators,
    saveChanges,
    addPage,
    removePage,
  } = useCanvasData(canvaId, user?.email);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const handleAddPreset = (type) => {
    console.log("Adding preset:", type);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };
  return (
    <ErrorBoundary>
      <div
        className={`flex flex-col h-screen ${
          fullScreen ? "bg-green-900" : "bg-green-50"
        }`}
      >
        {/* Header con tema verde */}
        <header className="flex items-center justify-between p-3 bg-green-800/90 backdrop-blur-md border-b border-green-700 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="text-green-300" />
            <span className="font-medium">Volver</span>
          </button>

          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
              Primer Parcial Software
            </h1>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full hover:bg-green-700 transition-colors"
              title={
                fullScreen ? "Salir de pantalla completa" : "Pantalla completa"
              }
            >
              {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>

          <UsersPanel collaborators={collaborators} currentUser={user.email} />
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main canvas area */}
          <div
            className={`flex-1 ${
              fullScreen ? "" : "m-2 rounded-xl overflow-hidden shadow-xl"
            }`}
          >
            <CanvasComponent
              canvaId={canvaId}
              initialNodes={nodes}
              initialEdges={edges}
              onSave={saveChanges}
            />
          </div>

          {/* Right sidebar */}
          {!fullScreen && (
            <div className="w-80 bg-green-800 border-l border-green-700 flex flex-col transition-all duration-300">
              {/* Tab selector */}
              <div className="flex p-1 bg-green-700 rounded-lg m-2">
                {[
                  { id: "pages", icon: Grid, label: "Páginas" },
                  { id: "layers", icon: Layers, label: "Capas" },
                  { id: "presets", icon: Settings, label: "Plantillas" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-1 transition-colors ${
                      activeRightPanel === tab.id
                        ? "bg-green-600 text-white"
                        : "text-green-200 hover:text-white"
                    }`}
                    onClick={() => setActiveRightPanel(tab.id)}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto text-green-100">
                {activeRightPanel === "pages" && (
                  <PagesPanel
                    pages={pages}
                    activePage={activePage}
                    onChangePage={setActivePage}
                    onAddPage={addPage}
                    onRemovePage={removePage}
                  />
                )}
                {activeRightPanel === "layers" && (
                  <LayersPanel
                    nodes={nodes}
                    selectedElement={null}
                    onSelect={(id) => console.log("Select", id)}
                    onReorder={(from, to) => console.log("Reorder", from, to)}
                  />
                )}
                {activeRightPanel === "presets" && (
                  <LayoutPresets onAddPreset={handleAddPreset} />
                )}
              </div>

              {/* Status bar */}
              <div className="p-2 text-xs text-green-300 border-t border-green-700 bg-green-900">
                <div className="flex justify-between">
                  <span>Páginas: {pages.length}</span>
                  <span>Elementos: {nodes.length}</span>
                  <span>Colaboradores: {collaborators.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CanvaPage;
