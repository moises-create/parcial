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
const BTN_ICON = 20; // smaller icon size for better proportions
const BTN_PAD = "p-2.5"; // adjusted padding interior
const TW_WIDTH = "w-64"; // slightly wider for better spacing

/* ─── tooltip component ─────────────────────────────────────────── */

/* ─── toolbar button component ───────────────────────────────────── */
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
    ? "text-gray-300 cursor-not-allowed opacity-50"
    : active
    ? "bg-blue-100 text-blue-700 shadow-inner border border-blue-200"
    : danger
    ? "hover:bg-red-50 text-red-500 hover:border hover:border-red-200"
    : "hover:bg-gray-100 text-gray-700 hover:border hover:border-gray-200";

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

/* ─── section component ────────────────────────────────────────── */
const ToolbarSection = ({
  title,
  children,
  expanded = true,
  toggleable = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="py-2 border-b border-gray-100 last:border-0">
      {title && (
        <div
          className={`flex items-center px-4 py-1 ${
            toggleable ? "cursor-pointer hover:bg-gray-50" : ""
          }`}
          onClick={toggleable ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase flex-1">
            {title}
          </h4>
          {toggleable && (
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${
                isExpanded ? "transform rotate-180" : ""
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

/* ─── main toolbar component ─────────────────────────────────────── */
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

  /* tools categorized by function */
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

  /* shortcuts */
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

  /* add node to center */
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

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <aside
      className={`${TW_WIDTH} bg-white shadow-lg flex flex-col relative z-10 border-r border-gray-200`}
    >
      {/* logo */}
      <div className="py-4 flex justify-center border-b border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl px-6 py-2 flex items-center justify-center font-bold text-lg shadow-md">
          <span className="mr-2">Flow</span>
          <Box size={18} />
        </div>
      </div>

      {/* navigation tools */}
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

      {/* shapes */}
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

      {/* content */}
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

      {/* components */}
      <ToolbarSection title="Components" toggleable={true}>
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

      {/* actions */}
      <ToolbarSection title="Actions">
        <ToolButton
          icon={Plus}
          tooltip="Add Selected Element"
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

      {/* selection-specific tools */}
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
            <ToolButton
              icon={Layers}
              tooltip="Layer Options"
              onClick={() => {}}
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

      {/* utilities footer */}
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
