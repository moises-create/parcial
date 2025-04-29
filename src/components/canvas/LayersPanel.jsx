import React from "react";
import { Eye, EyeOff, ArrowUp, ArrowDown } from "react-feather";

const LayersPanel = ({ nodes, selectedElement, onSelect, onReorder }) => {
  const handleVisibilityToggle = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      onSelect(nodeId);
      // The actual toggle will be handled by the parent component via the selectedElement
    }
  };

  const moveUp = (index) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < nodes.length - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-sm mb-3">Layers</h3>
      <div className="space-y-1">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedElement?.id === node.id
                ? "bg-blue-50 text-blue-700"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSelect(node.id)}
          >
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisibilityToggle(node.id);
                }}
                className="text-gray-400 hover:text-gray-600 mr-2"
              >
                {node.data.visible === false ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
              <span className="text-sm truncate">
                {node.data.label || node.type}
                {node.data.locked && (
                  <span className="ml-1 text-gray-400">(Locked)</span>
                )}
              </span>
            </div>
            <div className="flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveUp(index);
                }}
                className="text-gray-400 hover:text-gray-600 ml-2"
                disabled={index === 0}
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveDown(index);
                }}
                className="text-gray-400 hover:text-gray-600 ml-1"
                disabled={index === nodes.length - 1}
              >
                <ArrowDown size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayersPanel;
