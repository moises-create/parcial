/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import {
  MousePointer,
  Square,
  Circle,
  Type,
  Image,
  Move,
  Layout,
  LogIn,
  Menu,
  Copy,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Grid,
  Code,
  Save,
  Settings,
  Layers,
  Box,
  Sidebar,
} from "react-feather";

import Tooltip from "../UI/tooltip";

/* ─── visual constants ───────────────────────────────────────────── */
const BTN_ICON = 20;
const BTN_PAD = "p-2.5";
const TW_WIDTH = "w-64";

const greenTheme = {
  primary: "#10b981",
  primaryDark: "#059669",
  primaryLight: "#34d399",
  secondary: "#065f46",
  background: "#ecfdf5",
  text: "#064e3b",
  border: "#a7f3d0",
  panelBg: "rgba(236, 253, 245, 0.9)",
};

/* ─── toolbar button ───────────────────────────────────────────── */
const ToolButton = ({
  icon: Icon,
  tooltip,
  active,
  disabled,
  danger,
  onClick,
}) => {
  const base = `${BTN_PAD} rounded-lg flex items-center justify-center transition-all hover:scale-105`;
  const visual = disabled
    ? "text-green-200 cursor-not-allowed opacity-50"
    : active
    ? "bg-green-100 text-green-700 shadow-inner border border-green-200"
    : danger
    ? "hover:bg-red-50 text-red-500 hover:border hover:border-red-200"
    : "hover:bg-green-100 text-green-700 hover:border hover:border-green-200";

  return (
    <Tooltip content={tooltip} side="right">
      <button
        className={`${base} ${visual}`}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon size={BTN_ICON} />
      </button>
    </Tooltip>
  );
};

/* ─── section component ───────────────────────────────────────────── */
const ToolbarSection = ({
  title,
  children,
  expanded = true,
  toggleable = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="py-2 border-b border-green-100 last:border-0">
      {title && (
        <div
          className={`flex items-center px-4 py-1 ${
            toggleable ? "cursor-pointer hover:bg-green-50" : ""
          }`}
          onClick={toggleable ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <h4 className="text-xs font-semibold tracking-wide text-green-600 uppercase flex-1">
            {title}
          </h4>
          {toggleable && (
            <ChevronDown
              size={16}
              className={`text-green-400 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      )}
      <div
        className={`px-4 pt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-3 gap-2">{children}</div>
      </div>
    </div>
  );
};

/* ─── main toolbar ───────────────────────────────────────────── */
const Toolbar = ({
  activeTool,
  onToolChange,
  onAddNode,
  onCopy,
  onDelete,
  onAlign,
  onToggleVisibility,
  onToggleLock,
  onBringToFront,
  onSendToBack,
  flowInstance,
  selectedElement,
  onSave,
  onShowCode,
  onViewSettings,
}) => {
  const [showGrid, setShowGrid] = useState(true);

  const navigationTools = [
    { icon: MousePointer, tool: "select", tip: "Select (V)" },
    { icon: Move, tool: "pan", tip: "Pan (H)" },
    { icon: Sidebar, tool: "navigator", tip: "Navigator" },
  ];

  const shapeTools = [
    { icon: Square, tool: "rectangle", tip: "Rectangle (R)" },
    { icon: Circle, tool: "circle", tip: "Circle (C)" },
    { icon: Box, tool: "box", tip: "3D Box" },
  ];

  const contentTools = [
    { icon: Type, tool: "text", tip: "Text (T)" },
    { icon: Image, tool: "image", tip: "Image (I)" },
    { icon: Menu, tool: "button", tip: "Button (B)" },
  ];

  const componentTools = [
    { icon: Layout, tool: "header", tip: "Header" },
    { icon: LogIn, tool: "loginForm", tip: "Login form" },
    { icon: Layers, tool: "card", tip: "Card" },
  ];

  const keyHandler = useCallback(
    (e) => {
      const map = {
        v: "select",
        h: "pan",
        r: "rectangle",
        c: "circle",
        t: "text",
        i: "image",
        b: "button",
      };
      const k = e.key.toLowerCase();
      if (map[k]) onToolChange(map[k]);
      if (["Delete", "Backspace"].includes(e.key) && selectedElement)
        onDelete();
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedElement)
        onCopy();
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    },
    [onToolChange, selectedElement, onDelete, onCopy, onSave]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [keyHandler]);

  const handleAddNode = () => {
    if (!flowInstance || ["select", "pan", "navigator"].includes(activeTool))
      return;
    const pos = flowInstance.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    onAddNode(activeTool, pos);
    onToolChange("select");
  };

  const hasSel = !!selectedElement;
  const isNode = selectedElement && "width" in selectedElement;

  return (
    <aside
      className={`${TW_WIDTH} bg-green-50 shadow-lg flex flex-col relative z-10 border-r`}
      style={{ borderColor: greenTheme.border }}
    >
      {/* logo */}
      <div
        className="py-4 flex justify-center border-b"
        style={{ borderColor: greenTheme.border }}
      >
        <div
          className="text-white rounded-xl px-6 py-2 flex items-center justify-center font-bold text-lg shadow-md"
          style={{
            background: `linear-gradient(to bottom right, ${greenTheme.primary}, ${greenTheme.secondary})`,
          }}
        >
          <span className="mr-2">Parcial Moises</span>
          <Box size={18} />
        </div>
      </div>

      <ToolbarSection title="Navigation">
        {navigationTools.map(({ icon, tool, tip }) => (
          <ToolButton
            key={tool}
            icon={icon}
            tooltip={tip}
            active={activeTool === tool}
            onClick={() => onToolChange(tool)}
          />
        ))}
      </ToolbarSection>

      <ToolbarSection title="Shapes">
        {shapeTools.map(({ icon, tool, tip }) => (
          <ToolButton
            key={tool}
            icon={icon}
            tooltip={tip}
            active={activeTool === tool}
            onClick={() => onToolChange(tool)}
          />
        ))}
      </ToolbarSection>

      <ToolbarSection title="Content">
        {contentTools.map(({ icon, tool, tip }) => (
          <ToolButton
            key={tool}
            icon={icon}
            tooltip={tip}
            active={activeTool === tool}
            onClick={() => onToolChange(tool)}
          />
        ))}
      </ToolbarSection>

      <ToolbarSection title="Components" toggleable>
        {componentTools.map(({ icon, tool, tip }) => (
          <ToolButton
            key={tool}
            icon={icon}
            tooltip={tip}
            active={activeTool === tool}
            onClick={() => onToolChange(tool)}
          />
        ))}
      </ToolbarSection>

      <ToolbarSection title="Actions">
        <ToolButton
          icon={Plus}
          tooltip="Add Node"
          onClick={handleAddNode}
          disabled={["select", "pan", "navigator"].includes(activeTool)}
        />
        <ToolButton
          icon={Copy}
          tooltip="Duplicate (Ctrl+C)"
          onClick={onCopy}
          disabled={!hasSel}
        />
        <ToolButton
          icon={Trash2}
          tooltip="Delete (Del)"
          onClick={onDelete}
          disabled={!hasSel}
          danger
        />
      </ToolbarSection>

      {isNode && (
        <div className="animate-in fade-in-0 duration-300">
          <ToolbarSection title="Alignment">
            <ToolButton
              icon={AlignLeft}
              tooltip="Align Left"
              onClick={() => onAlign("left")}
            />
            <ToolButton
              icon={AlignCenter}
              tooltip="Align Center"
              onClick={() => onAlign("center")}
            />
            <ToolButton
              icon={AlignRight}
              tooltip="Align Right"
              onClick={() => onAlign("right")}
            />
          </ToolbarSection>

          <ToolbarSection title="Visibility">
            <ToolButton
              icon={selectedElement.data?.visible === false ? EyeOff : Eye}
              tooltip={
                selectedElement.data?.visible === false ? "Show" : "Hide"
              }
              onClick={() => onToggleVisibility(selectedElement.id)}
            />
            <ToolButton
              icon={selectedElement.data?.locked ? Lock : Unlock}
              tooltip={selectedElement.data?.locked ? "Unlock" : "Lock"}
              onClick={() => onToggleLock(selectedElement.id)}
            />
          </ToolbarSection>

          <ToolbarSection title="Order">
            <ToolButton
              icon={ChevronUp}
              tooltip="Bring to Front"
              onClick={onBringToFront}
            />
            <ToolButton
              icon={ChevronDown}
              tooltip="Send to Back"
              onClick={onSendToBack}
            />
          </ToolbarSection>
        </div>
      )}

      <div className="flex-1" />

      <ToolbarSection>
        <ToolButton
          icon={Grid}
          active={showGrid}
          tooltip={showGrid ? "Hide Grid" : "Show Grid"}
          onClick={() => setShowGrid(!showGrid)}
        />
        <ToolButton icon={Code} tooltip="Export Code" onClick={onShowCode} />
        <ToolButton icon={Save} tooltip="Save (Ctrl+S)" onClick={onSave} />
        <ToolButton
          icon={Settings}
          tooltip="Settings"
          onClick={onViewSettings}
        />
      </ToolbarSection>
    </aside>
  );
};

export default React.memo(Toolbar);
