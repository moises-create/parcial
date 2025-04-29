// renders.jsx
import React from "react";
import {
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FlipHorizontal,
  FlipVertical,
  MousePointer,
  Move,
  RotateCw,
  Type,
  Circle,
  Square,
  Minus,
  Image,
  Sliders,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";

export const renderNoSelection = () => (
  <div className="h-full flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center pt-20">
    <div className="animate-bounce-slow">
      <MousePointer className="text-indigo-500 h-14 w-14 opacity-90" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Selecciona un elemento
    </h3>
    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
      Haz clic en cualquier elemento del canvas para comenzar a editarlo
    </p>
  </div>
);

// eslint-disable-next-line no-unused-vars, react-refresh/only-export-components
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="text-indigo-500 h-4 w-4" />
    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {title}
    </h4>
  </div>
);

// eslint-disable-next-line react-refresh/only-export-components
const InputGroup = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  icon: Icon,
  className,
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs text-gray-500 flex items-center gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
    />
  </div>
);

export const renderDimensionControls = (
  selectedShape,
  handleNumberChange,
  handleChange
) => {
  const { type } = selectedShape;

  if (type === "circle") {
    return (
      <div className="space-y-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <SectionHeader icon={Circle} title="Radio del círculo" />
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="300"
              value={selectedShape.radius || 0}
              onChange={(e) => handleNumberChange("radius", e.target.value)}
              className="flex-1 h-1.5 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full cursor-pointer appearance-none"
            />
            <InputGroup
              label="Valor"
              value={selectedShape.radius || 0}
              onChange={(e) => handleNumberChange("radius", e.target.value)}
              icon={null}
              className="w-20"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type !== "line") {
    return (
      <div className="space-y-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <SectionHeader icon={Square} title="Dimensiones" />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Ancho"
              value={selectedShape.width || 0}
              onChange={(e) => handleNumberChange("width", e.target.value)}
              icon={null}
            />
            <InputGroup
              label="Alto"
              value={selectedShape.height || 0}
              onChange={(e) => handleNumberChange("height", e.target.value)}
              icon={null}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <SectionHeader icon={Sliders} title="Proporción" />
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={(selectedShape.width || 1) / (selectedShape.height || 1)}
              onChange={(e) => {
                const ratio = parseFloat(e.target.value);
                if (ratio > 0) {
                  handleNumberChange(
                    "width",
                    (selectedShape.height || 1) * ratio
                  );
                }
              }}
              className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-10 text-center font-medium">
              {(
                (selectedShape.width || 1) / (selectedShape.height || 1)
              ).toFixed(1)}
              :1
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="space-y-5">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <SectionHeader icon={Minus} title="Puntos de la línea" />
          <div className="grid grid-cols-2 gap-3">
            <InputGroup
              label="Inicio X"
              value={Math.round(selectedShape.points?.[0] || 0)}
              onChange={(e) => {
                const points = [...(selectedShape.points || [0, 0, 100, 100])];
                points[0] = parseFloat(e.target.value);
                handleChange("points", points);
              }}
              icon={null}
            />
            <InputGroup
              label="Inicio Y"
              value={Math.round(selectedShape.points?.[1] || 0)}
              onChange={(e) => {
                const points = [...(selectedShape.points || [0, 0, 100, 100])];
                points[1] = parseFloat(e.target.value);
                handleChange("points", points);
              }}
              icon={null}
            />
            <InputGroup
              label="Fin X"
              value={Math.round(selectedShape.points?.[2] || 0)}
              onChange={(e) => {
                const points = [...(selectedShape.points || [0, 0, 100, 100])];
                points[2] = parseFloat(e.target.value);
                handleChange("points", points);
              }}
              icon={null}
            />
            <InputGroup
              label="Fin Y"
              value={Math.round(selectedShape.points?.[3] || 0)}
              onChange={(e) => {
                const points = [...(selectedShape.points || [0, 0, 100, 100])];
                points[3] = parseFloat(e.target.value);
                handleChange("points", points);
              }}
              icon={null}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const renderPositionControls = (
  selectedShape,
  handleNumberChange,
  flipShape
) => (
  <div className="space-y-5">
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Move} title="Posición" />
      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          label="Posición X"
          value={Math.round(selectedShape.x || 0)}
          onChange={(e) => handleNumberChange("x", e.target.value)}
          icon={null}
        />
        <InputGroup
          label="Posición Y"
          value={Math.round(selectedShape.y || 0)}
          onChange={(e) => handleNumberChange("y", e.target.value)}
          icon={null}
        />
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={RotateCw} title="Rotación" />
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="360"
          value={Math.round(selectedShape.rotation || 0)}
          onChange={(e) => handleNumberChange("rotation", e.target.value)}
          className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
        />
        <InputGroup
          label="Grados"
          value={Math.round(selectedShape.rotation || 0)}
          onChange={(e) => handleNumberChange("rotation", e.target.value)}
          icon={null}
          className="w-20"
        />
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={FlipHorizontal} title="Transformación" />
      <div className="flex gap-2">
        <button
          onClick={() => flipShape("horizontal")}
          className="flex-1 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors"
        >
          <FlipHorizontal size={16} />
          <span>Horizontal</span>
        </button>
        <button
          onClick={() => flipShape("vertical")}
          className="flex-1 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors"
        >
          <FlipVertical size={16} />
          <span>Vertical</span>
        </button>
      </div>
    </div>
  </div>
);

export const renderStyleControls = (
  selectedShape,
  handleChange,
  handleNumberChange,
  showColorPicker,
  setShowColorPicker
) => (
  <div className="space-y-5">
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Square} title="Color" />
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Relleno</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setShowColorPicker(showColorPicker === "fill" ? null : "fill")
              }
              className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-indigo-300 transition-colors shadow-sm"
              style={{ backgroundColor: selectedShape.fill || "#ffffff" }}
            />
            <input
              type="text"
              value={selectedShape.fill || "#ffffff"}
              onChange={(e) => handleChange("fill", e.target.value)}
              className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400"
            />
          </div>
          {showColorPicker === "fill" && (
            <div className="mt-3">
              <HexColorPicker
                color={selectedShape.fill || "#ffffff"}
                onChange={(color) => handleChange("fill", color)}
                className="!w-full"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Borde</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setShowColorPicker(
                  showColorPicker === "stroke" ? null : "stroke"
                )
              }
              className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-indigo-300 transition-colors shadow-sm"
              style={{ backgroundColor: selectedShape.stroke || "#000000" }}
            />
            <input
              type="text"
              value={selectedShape.stroke || "#000000"}
              onChange={(e) => handleChange("stroke", e.target.value)}
              className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400"
            />
          </div>
          {showColorPicker === "stroke" && (
            <div className="mt-3">
              <HexColorPicker
                color={selectedShape.stroke || "#000000"}
                onChange={(color) => handleChange("stroke", color)}
                className="!w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Square} title="Borde" />
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Grosor</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={selectedShape.strokeWidth || 1}
              onChange={(e) =>
                handleNumberChange("strokeWidth", e.target.value)
              }
              className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
            <InputGroup
              label=""
              value={selectedShape.strokeWidth || 1}
              onChange={(e) =>
                handleNumberChange("strokeWidth", e.target.value)
              }
              min="0"
              step="0.5"
              className="w-16"
            />
          </div>
        </div>

        {selectedShape.type !== "line" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Radio de esquinas
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="50"
                value={selectedShape.cornerRadius || 0}
                onChange={(e) =>
                  handleNumberChange("cornerRadius", e.target.value)
                }
                className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
              <InputGroup
                label=""
                value={selectedShape.cornerRadius || 0}
                onChange={(e) =>
                  handleNumberChange("cornerRadius", e.target.value)
                }
                min="0"
                className="w-16"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Square} title="Opacidad" />
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selectedShape.opacity || 1}
          onChange={(e) => handleNumberChange("opacity", e.target.value)}
          className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
        />
        <span className="text-xs text-gray-500 w-12 text-center font-medium">
          {Math.round((selectedShape.opacity || 1) * 100)}%
        </span>
      </div>
    </div>
  </div>
);

export const renderTextControls = (
  selectedShape,
  handleChange,
  handleNumberChange
) => {
  if (selectedShape.type !== "text") return null;

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <SectionHeader icon={Type} title="Contenido" />
        <textarea
          value={selectedShape.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          rows="3"
          placeholder="Escribe tu texto aquí..."
        />
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <SectionHeader icon={Type} title="Tipografía" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Familia</label>
            <select
              value={selectedShape.fontFamily || "Arial"}
              onChange={(e) => handleChange("fontFamily", e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-300 focus:border-indigo-400"
            >
              {[
                "Arial",
                "Helvetica",
                "Times New Roman",
                "Courier New",
                "Verdana",
                "Georgia",
                "Tahoma",
                "Trebuchet MS",
                "Impact",
              ].map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tamaño</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="8"
                max="72"
                value={selectedShape.fontSize || 16}
                onChange={(e) => handleNumberChange("fontSize", e.target.value)}
                className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
              <InputGroup
                label=""
                value={selectedShape.fontSize || 16}
                onChange={(e) => handleNumberChange("fontSize", e.target.value)}
                className="w-16"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <SectionHeader icon={Type} title="Estilo de texto" />
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Alineación
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange("textAlign", "left")}
                className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-1 text-xs ${
                  selectedShape.textAlign === "left"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AlignLeft size={14} />
                Izquierda
              </button>
              <button
                onClick={() => handleChange("textAlign", "center")}
                className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-1 text-xs ${
                  selectedShape.textAlign === "center"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AlignCenter size={14} />
                Centro
              </button>
              <button
                onClick={() => handleChange("textAlign", "right")}
                className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-1 text-xs ${
                  selectedShape.textAlign === "right"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <AlignRight size={14} />
                Derecha
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Formato</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  handleChange(
                    "fontWeight",
                    selectedShape.fontWeight === "bold" ? "normal" : "bold"
                  )
                }
                className={`py-2 px-1 border rounded-lg text-xs ${
                  selectedShape.fontWeight === "bold"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <b>Negrita</b>
              </button>
              <button
                onClick={() =>
                  handleChange(
                    "fontStyle",
                    selectedShape.fontStyle === "italic" ? "normal" : "italic"
                  )
                }
                className={`py-2 px-1 border rounded-lg text-xs ${
                  selectedShape.fontStyle === "italic"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <i>Cursiva</i>
              </button>
              <button
                onClick={() =>
                  handleChange(
                    "textDecoration",
                    selectedShape.textDecoration === "underline"
                      ? "none"
                      : "underline"
                  )
                }
                className={`py-2 px-1 border rounded-lg text-xs ${
                  selectedShape.textDecoration === "underline"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <u>Subrayado</u>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderLayerControls = (selectedShape, onChange, toggleLock) => (
  <div className="space-y-5">
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Square} title="Orden de capas" />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            onChange({
              ...selectedShape,
              zIndex: (selectedShape.zIndex || 0) + 1,
            })
          }
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
        >
          Traer adelante
        </button>
        <button
          onClick={() =>
            onChange({
              ...selectedShape,
              zIndex: (selectedShape.zIndex || 0) - 1,
            })
          }
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
        >
          Enviar atrás
        </button>
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Lock} title="Bloqueo" />
      <button
        onClick={toggleLock}
        className={`w-full p-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
          selectedShape.draggable === false
            ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        {selectedShape.draggable === false ? (
          <Lock size={16} />
        ) : (
          <Unlock size={16} />
        )}
        <span>
          {selectedShape.draggable === false ? "Desbloquear" : "Bloquear"}
        </span>
      </button>
    </div>
  </div>
);

export const renderExportControls = (selectedShape) => (
  <div className="space-y-5">
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <SectionHeader icon={Square} title="Exportar elemento" />
      <div className="space-y-3">
        <AngularExporter
          shapes={[selectedShape]}
          stageSize={{
            width: selectedShape.width || 300,
            height: selectedShape.height || 200,
          }}
        />
      </div>
    </div>
  </div>
);
