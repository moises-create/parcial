import React from "react";
import { Layout, LogIn, Square, Type, Image, Circle } from "react-feather";

const presets = [
  {
    name: "Header",
    type: "header",
    icon: <Layout size={20} />,
    description: "Navigation header with logo and menu items",
  },
  {
    name: "Login Form",
    type: "loginForm",
    icon: <LogIn size={20} />,
    description: "Complete login form with fields and button",
  },
  {
    name: "Rectangle",
    type: "rectangle",
    icon: <Square size={20} />,
    description: "Basic rectangle shape",
  },
  {
    name: "Circle",
    type: "circle",
    icon: <Circle size={20} />,
    description: "Basic circle shape",
  },
  {
    name: "Text",
    type: "text",
    icon: <Type size={20} />,
    description: "Text content section",
  },
  {
    name: "Image",
    type: "image",
    icon: <Image size={20} />,
    description: "Image container",
  },
];

const LayoutPresets = ({ onAddPreset }) => {
  return (
    <div className="p-4 border-b">
      <h3 className="font-medium text-sm mb-3">Layout Presets</h3>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.type}
            onClick={() => onAddPreset(preset.type)}
            className="border rounded p-3 hover:bg-gray-50 transition-colors text-left flex flex-col"
          >
            <div className="flex items-center mb-2">
              <div className="mr-2 text-blue-500">{preset.icon}</div>
              <span className="font-medium text-sm">{preset.name}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutPresets;
