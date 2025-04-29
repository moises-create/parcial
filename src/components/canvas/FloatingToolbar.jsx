// FloatingToolbar.js - Nuevo componente
import React from "react";
import {
  MousePointer,
  Square,
  Type,
  Image,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "react-feather";

const iconComponents = {
  select: MousePointer,
  rectangle: Square,
  text: Type,
  image: Image,
  copy: Copy,
  delete: Trash2,
  visible: Eye,
  hidden: EyeOff,
  locked: Lock,
  unlocked: Unlock,
};

const FloatingToolbar = ({ position, tools, activeTool }) => {
  return (
    <div
      className={`absolute ${position}-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 p-3 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-700`}
    >
      {tools.map((tool) => {
        const Icon = iconComponents[tool.icon];
        return (
          <button
            key={tool.icon}
            onClick={tool.action}
            className={`p-3 rounded-lg transition-all ${
              activeTool === tool.icon
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
            aria-label={tool.icon}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default FloatingToolbar;
