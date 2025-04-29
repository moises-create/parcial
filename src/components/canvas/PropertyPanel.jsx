// PropertyPanel.js
import React, { useEffect } from "react";
import { Lock, Unlock, Eye, EyeOff } from "react-feather";

// Soft green theme colors
const softGreenTheme = {
  primary: "#10b981",
  primaryLight: "#d1fae5",
  primaryDark: "#059669",
  textPrimary: "#047857",
  textSecondary: "#6b7280",
  borderColor: "#a7f3d0",
  background: "#f0fdf4",
  inputBg: "#ffffff",
  hoverBg: "#ecfdf5",
};

const PropertyPanel = ({ selectedElement, onChange }) => {
  useEffect(() => {
    console.log("Selected element updated:", selectedElement);
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div
        className="w-72 border-l p-6 flex items-center justify-center"
        style={{ backgroundColor: softGreenTheme.background }}
      >
        <p className="text-gray-500 text-sm text-center">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    const updatedElement = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        [key]: value,
      },
    };
    onChange(updatedElement);
  };

  const handleStyleChange = (key, inputValue) => {
    const numericKeys = ["width", "height", "fontSize"];
    const value = numericKeys.includes(key) ? parseInt(inputValue) : inputValue;

    const updatedElement = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        style: {
          ...selectedElement.data?.style,
          [key]: value,
        },
      },
    };
    onChange(updatedElement);
  };

  const handleArrayChange = (key, index, value) => {
    const newArray = [...selectedElement.data[key]];
    newArray[index] = value;
    handleChange(key, newArray);
  };

  const handleAddArrayItem = (key, defaultValue) => {
    handleChange(key, [...(selectedElement.data[key] || []), defaultValue]);
  };

  const handleRemoveArrayItem = (key, index) => {
    const newArray = [...selectedElement.data[key]];
    newArray.splice(index, 1);
    handleChange(key, newArray);
  };

  const toggleVisibility = () => {
    handleChange("visible", !selectedElement.data.visible);
  };

  const toggleLock = () => {
    const locked = !selectedElement.data.locked;
    handleChange("locked", locked);
    onChange({
      ...selectedElement,
      draggable: !locked,
      data: {
        ...selectedElement.data,
        locked,
      },
    });
  };

  const renderCommonProperties = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4
          className="font-medium text-sm"
          style={{ color: softGreenTheme.textPrimary }}
        >
          Element Properties
        </h4>
        <div className="flex gap-2">
          <button
            onClick={toggleVisibility}
            className="p-1.5 rounded transition-colors"
            style={{
              color: softGreenTheme.textPrimary,
              backgroundColor:
                selectedElement.data.visible === false
                  ? softGreenTheme.primaryLight
                  : "transparent",
              hover: { backgroundColor: softGreenTheme.hoverBg },
            }}
            title={selectedElement.data.visible === false ? "Show" : "Hide"}
          >
            {selectedElement.data.visible === false ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
          <button
            onClick={toggleLock}
            className="p-1.5 rounded transition-colors"
            style={{
              color: softGreenTheme.textPrimary,
              backgroundColor: selectedElement.data.locked
                ? softGreenTheme.primaryLight
                : "transparent",
              hover: { backgroundColor: softGreenTheme.hoverBg },
            }}
            title={selectedElement.data.locked ? "Unlock" : "Lock"}
          >
            {selectedElement.data.locked ? (
              <Lock size={16} />
            ) : (
              <Unlock size={16} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-medium mb-1"
          style={{ color: softGreenTheme.textPrimary }}
        >
          Name
        </label>
        <input
          type="text"
          value={selectedElement.data.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          className="w-full p-2 border rounded text-sm transition-all"
          style={{
            borderColor: softGreenTheme.borderColor,
            backgroundColor: softGreenTheme.inputBg,
            color: softGreenTheme.textPrimary,
            outline: "none",
          }}
        />
      </div>

      {["rectangle", "circle", "button", "header", "loginForm"].includes(
        selectedElement.type
      ) && (
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: softGreenTheme.textPrimary }}
          >
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedElement.data?.style?.fill || "#ffffff"}
              onChange={(e) => handleStyleChange("fill", e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
              style={{ border: `1px solid ${softGreenTheme.borderColor}` }}
            />
            <span
              className="text-xs"
              style={{ color: softGreenTheme.textSecondary }}
            >
              {selectedElement.data?.style?.fill || "#ffffff"}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderTypeSpecificProperties = () => {
    switch (selectedElement.type) {
      case "text":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Content
              </label>
              <textarea
                value={selectedElement.data.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: softGreenTheme.textPrimary }}
                >
                  Font Size
                </label>
                <input
                  type="number"
                  value={selectedElement.data?.style?.fontSize || 16}
                  onChange={(e) =>
                    handleStyleChange("fontSize", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm transition-all"
                  style={{
                    borderColor: softGreenTheme.borderColor,
                    backgroundColor: softGreenTheme.inputBg,
                    color: softGreenTheme.textPrimary,
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: softGreenTheme.textPrimary }}
                >
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.data?.style?.color || "#000000"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                    style={{
                      border: `1px solid ${softGreenTheme.borderColor}`,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: softGreenTheme.textSecondary }}
                  >
                    {selectedElement.data?.style?.color || "#000000"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Image URL
              </label>
              <input
                type="text"
                value={selectedElement.data.src || ""}
                onChange={(e) => handleChange("src", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );

      case "header":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Logo URL
              </label>
              <input
                type="text"
                value={selectedElement.data.logo || ""}
                onChange={(e) => handleChange("logo", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
                placeholder="/logo.png"
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Navigation Items
              </label>
              <div className="space-y-2">
                {selectedElement.data.navItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("navItems", index, e.target.value)
                      }
                      className="flex-1 p-2 border rounded text-sm transition-all"
                      style={{
                        borderColor: softGreenTheme.borderColor,
                        backgroundColor: softGreenTheme.inputBg,
                        color: softGreenTheme.textPrimary,
                      }}
                    />
                    <button
                      onClick={() => handleRemoveArrayItem("navItems", index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddArrayItem("navItems", "New Item")}
                  className="w-full py-1.5 text-xs rounded transition-colors"
                  style={{
                    color: softGreenTheme.primary,
                    backgroundColor: softGreenTheme.primaryLight,
                    hover: { backgroundColor: softGreenTheme.hoverBg },
                  }}
                >
                  + Add Navigation Item
                </button>
              </div>
            </div>
          </div>
        );

      case "loginForm":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Title
              </label>
              <input
                type="text"
                value={selectedElement.data.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.data.showLogo || false}
                onChange={(e) => handleChange("showLogo", e.target.checked)}
                className="h-4 w-4 rounded"
                style={{ color: softGreenTheme.primary }}
                id="showLogo"
              />
              <label
                htmlFor="showLogo"
                className="text-xs"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Show Logo
              </label>
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Button Text
              </label>
              <input
                type="text"
                value={selectedElement.data.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Button Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.data.buttonColor || "#3b82f6"}
                  onChange={(e) => handleChange("buttonColor", e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                  style={{ border: `1px solid ${softGreenTheme.borderColor}` }}
                />
                <span
                  className="text-xs"
                  style={{ color: softGreenTheme.textSecondary }}
                >
                  {selectedElement.data.buttonColor || "#3b82f6"}
                </span>
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Form Fields
              </label>
              <div className="space-y-3">
                {selectedElement.data.fields?.map((field, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-lg"
                    style={{ borderColor: softGreenTheme.borderColor }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: softGreenTheme.textPrimary }}
                      >
                        Field {index + 1}
                      </span>
                      <button
                        onClick={() => {
                          const newFields = [...selectedElement.data.fields];
                          newFields.splice(index, 1);
                          handleChange("fields", newFields);
                        }}
                        className="text-xs p-1 rounded"
                        style={{
                          color: "#ef4444",
                          hover: { backgroundColor: "#fee2e2" },
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].label = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      placeholder="Label"
                      className="w-full p-1.5 border rounded text-xs mb-2 transition-all"
                      style={{
                        borderColor: softGreenTheme.borderColor,
                        backgroundColor: softGreenTheme.inputBg,
                        color: softGreenTheme.textPrimary,
                      }}
                    />
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].type = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      className="w-full p-1.5 border rounded text-xs mb-2 transition-all"
                      style={{
                        borderColor: softGreenTheme.borderColor,
                        backgroundColor: softGreenTheme.inputBg,
                        color: softGreenTheme.textPrimary,
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="password">Password</option>
                      <option value="number">Number</option>
                    </select>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => {
                        const newFields = [...selectedElement.data.fields];
                        newFields[index].placeholder = e.target.value;
                        handleChange("fields", newFields);
                      }}
                      placeholder="Placeholder"
                      className="w-full p-1.5 border rounded text-xs transition-all"
                      style={{
                        borderColor: softGreenTheme.borderColor,
                        backgroundColor: softGreenTheme.inputBg,
                        color: softGreenTheme.textPrimary,
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    handleAddArrayItem("fields", {
                      label: "New Field",
                      type: "text",
                      placeholder: "",
                    })
                  }
                  className="w-full py-1.5 text-xs rounded transition-colors"
                  style={{
                    color: softGreenTheme.primary,
                    backgroundColor: softGreenTheme.primaryLight,
                    hover: { backgroundColor: softGreenTheme.hoverBg },
                  }}
                >
                  + Add Form Field
                </button>
              </div>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Button Text
              </label>
              <input
                type="text"
                value={selectedElement.data.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.data?.style?.textColor || "#ffffff"}
                  onChange={(e) =>
                    handleStyleChange("textColor", e.target.value)
                  }
                  className="w-8 h-8 rounded cursor-pointer"
                  style={{ border: `1px solid ${softGreenTheme.borderColor}` }}
                />
                <span
                  className="text-xs"
                  style={{ color: softGreenTheme.textSecondary }}
                >
                  {selectedElement.data?.style?.textColor || "#ffffff"}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Width
              </label>
              <input
                type="number"
                value={selectedElement.data?.style?.width || 100}
                onChange={(e) =>
                  handleStyleChange("width", parseInt(e.target.value))
                }
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: softGreenTheme.textPrimary }}
              >
                Height
              </label>
              <input
                type="number"
                value={selectedElement.data?.style?.height || 100}
                onChange={(e) =>
                  handleStyleChange("height", parseInt(e.target.value))
                }
                className="w-full p-2 border rounded text-sm transition-all"
                style={{
                  borderColor: softGreenTheme.borderColor,
                  backgroundColor: softGreenTheme.inputBg,
                  color: softGreenTheme.textPrimary,
                }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="w-72 border-l p-6 overflow-y-auto"
      style={{
        backgroundColor: softGreenTheme.background,
        borderColor: softGreenTheme.borderColor,
      }}
    >
      <h3 className="font-medium text-sm mb-4 flex items-center">
        <span
          className="capitalize"
          style={{ color: softGreenTheme.textPrimary }}
        >
          {selectedElement.type}
        </span>
        <span
          className="ml-auto text-xs font-mono"
          style={{ color: softGreenTheme.textSecondary }}
        >
          {selectedElement.id.slice(0, 6)}
        </span>
      </h3>

      {renderCommonProperties()}
      {renderTypeSpecificProperties()}
    </div>
  );
};

export default React.memo(PropertyPanel);
