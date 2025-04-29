import React from "react";
import { Handle, Position } from "reactflow";

const baseNodeClasses = (selected) =>
  `transition-all duration-300 ${
    selected
      ? "ring-2 ring-indigo-400 shadow-xl"
      : "ring-1 ring-gray-600 shadow-lg"
  }`;

const FuturisticNode = ({ children, data, selected, type }) => (
  <div
    className={`${baseNodeClasses(selected)} rounded-xl overflow-hidden ${
      type === "text" ? "bg-gray-800/80 backdrop-blur-sm" : "bg-gray-800"
    }`}
    style={{
      opacity: data.visible === false ? 0.3 : 1,
      pointerEvents: data.locked ? "none" : "auto",
      ...data.style,
    }}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-gray-900"
    />
    {children}
    <Handle
      type="source"
      position={Position.Bottom}
      className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-gray-900"
    />
  </div>
);

const TextNode = ({ data, selected }) => (
  <FuturisticNode data={data} selected={selected} type="text">
    <div className="p-4" style={{ color: data.style?.color || "#e2e8f0" }}>
      {data.text || data.label || "Text"}
    </div>
  </FuturisticNode>
);

const RectangleNode = ({ data, selected }) => (
  <FuturisticNode data={data} selected={selected}>
    <div
      className="flex items-center justify-center h-full"
      style={{ backgroundColor: data.style?.fill || "#4f46e5" }}
    >
      <span className="text-gray-100 px-4 py-2 text-center">
        {data.label || "Rectangle"}
      </span>
    </div>
  </FuturisticNode>
);

const CircleNode = ({ data, selected }) => {
  const size = Math.max(data.style?.width || 100, data.style?.height || 100);

  return (
    <div
      className={`rounded-full flex items-center justify-center ${baseNodeClasses(
        selected
      )}`}
      style={{
        backgroundColor: data.style?.fill || "#4f46e5",
        border: `${data.style?.borderWidth || 1}px solid ${
          data.style?.stroke || "#4338ca"
        }`,
        width: size,
        height: size,
        opacity: data.visible === false ? 0.5 : 1,
        pointerEvents: data.locked ? "none" : "auto",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !bg-gray-400"
      />
      <span
        style={{
          color: data.style?.textColor || "white",
          fontSize: `${data.style?.fontSize || 14}px`,
          textAlign: "center",
        }}
      >
        {data.label || "Circle"}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-gray-400"
      />
    </div>
  );
};

const ImageNode = ({ data, selected }) => {
  return (
    <div
      className={`overflow-hidden rounded-md ${baseNodeClasses(selected)}`}
      style={{
        width: data.style?.width || 150,
        height: data.style?.height || 150,
        opacity: data.visible === false ? 0.5 : data.style?.opacity || 1,
        pointerEvents: data.locked ? "none" : "auto",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !bg-gray-400"
      />
      <img
        src={data.src || "/placeholder-image.jpg"}
        alt={data.label || "Image"}
        className="w-full h-full object-cover"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-gray-400"
      />
    </div>
  );
};

const HeaderNode = ({ data, selected }) => {
  return (
    <div
      className={`${baseNodeClasses(selected)}`}
      style={{
        backgroundColor: data.style?.fill || "#ffffff",
        border: `${data.style?.borderWidth || 1}px solid ${
          data.style?.stroke || "#e5e7eb"
        }`,
        width: data.style?.width || "100%",
        height: data.style?.height || 60,
        opacity: data.visible === false ? 0.5 : 1,
        pointerEvents: data.locked ? "none" : "auto",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !bg-gray-400"
      />
      <div className="flex items-center h-full px-4">
        {data.logo && <img src={data.logo} alt="Logo" className="h-8 mr-4" />}
        <nav className="flex space-x-6">
          {data.navItems?.map((item, index) => (
            <div
              key={index}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-default"
            >
              {item}
            </div>
          ))}
        </nav>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-gray-400"
      />
    </div>
  );
};

const LoginFormNode = ({ data, selected }) => {
  return (
    <div
      className={`rounded-lg p-6 ${baseNodeClasses(selected)}`}
      style={{
        backgroundColor: data.style?.fill || "#ffffff",
        border: `${data.style?.borderWidth || 1}px solid ${
          data.style?.stroke || "#e5e7eb"
        }`,
        width: data.style?.width || 320,
        height: data.style?.height || 400,
        opacity: data.visible === false ? 0.5 : 1,
        pointerEvents: data.locked ? "none" : "auto",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !bg-gray-400"
      />
      <div className="flex flex-col items-center h-full">
        {data.showLogo && (
          <img src="/logo-placeholder.png" alt="Logo" className="h-12 mb-6" />
        )}
        <h2 className="text-xl font-semibold mb-6">{data.title || "Login"}</h2>

        <div className="w-full space-y-4 mb-6">
          {data.fields?.map((field, index) => (
            <div key={index} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded text-sm"
                readOnly
              />
            </div>
          ))}
        </div>

        <button
          className="w-full py-2 px-4 text-white rounded hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: data.buttonColor || "#3b82f6" }}
        >
          {data.buttonText || "Sign In"}
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-gray-400"
      />
    </div>
  );
};

const ButtonNode = ({ data, selected }) => {
  return (
    <div
      className={`rounded-md ${baseNodeClasses(selected)}`}
      style={{
        backgroundColor: data.style?.fill || "#3b82f6",
        border: `${data.style?.borderWidth || 1}px solid ${
          data.style?.stroke || "#2563eb"
        }`,
        width: data.style?.width || 120,
        height: data.style?.height || 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: data.visible === false ? 0.5 : 1,
        pointerEvents: data.locked ? "none" : "auto",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !bg-gray-400"
      />
      <span
        style={{
          color: data.style?.textColor || "white",
          fontSize: `${data.style?.fontSize || 14}px`,
        }}
      >
        {data.text || data.label || "Button"}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-gray-400"
      />
    </div>
  );
};

export const nodeTypes = {
  text: React.memo(TextNode),
  rectangle: React.memo(RectangleNode),
  circle: React.memo(CircleNode),
  image: React.memo(ImageNode),
  header: React.memo(HeaderNode),
  loginForm: React.memo(LoginFormNode),
  button: React.memo(ButtonNode),
};
