import React, { useState } from "react";
import { DownloadIcon, FileJson2 } from "lucide-react";

const AngularExporter = ({ shapes, stageSize }) => {
  const [exportMode, setExportMode] = useState("component"); // 'component' o 'page'
  const [componentName, setComponentName] = useState("CanvasComponent");

  const generateAngularCode = () => {
    const isPage = exportMode === "page";
    const className = isPage ? "CanvasPage" : componentName;

    // Generar imports
    let imports = `import { Component${
      isPage ? "" : ", Input"
    } } from '@angular/core';\n`;
    if (shapes.some((shape) => shape.type === "text")) {
      imports += `import { CommonModule } from '@angular/common';\n`;
    }

    // Generar template
    const template = shapes
      .map((shape) => {
        const style = [];
        const classes = [];

        // Posicionamiento
        if (isPage) {
          style.push(`position: absolute`);
          style.push(`left: ${shape.x}px`);
          style.push(`top: ${shape.y}px`);
        } else {
          classes.push("shape");
        }

        // Transformaciones
        if (shape.rotation) {
          style.push(`transform: rotate(${shape.rotation}deg)`);
        }
        if (shape.opacity && shape.opacity !== 1) {
          style.push(`opacity: ${shape.opacity}`);
        }

        // Estilos específicos por tipo
        switch (shape.type) {
          case "rectangle":
            style.push(`width: ${shape.width}px`);
            style.push(`height: ${shape.height}px`);
            style.push(`background-color: ${shape.fill || "#3498db"}`);
            if (shape.stroke) {
              style.push(
                `border: ${shape.strokeWidth || 1}px solid ${shape.stroke}`
              );
            }
            if (shape.cornerRadius) {
              style.push(`border-radius: ${shape.cornerRadius}px`);
            }
            return `<div class="${classes.join(" ")}" style="${style.join(
              "; "
            )}"></div>`;

          case "circle":
            style.push(`width: ${shape.radius * 2}px`);
            style.push(`height: ${shape.radius * 2}px`);
            style.push(`border-radius: 50%`);
            style.push(`background-color: ${shape.fill || "#3498db"}`);
            if (shape.stroke) {
              style.push(
                `border: ${shape.strokeWidth || 1}px solid ${shape.stroke}`
              );
            }
            return `<div class="${classes.join(" ")}" style="${style.join(
              "; "
            )}"></div>`;

          case "text":
            style.push(`font-size: ${shape.fontSize || 16}px`);
            style.push(`color: ${shape.fill || "#000"}`);
            style.push(`font-family: ${shape.fontFamily || "Arial"}`);
            style.push(`margin: 0`);
            if (shape.fontWeight === "bold") style.push(`font-weight: bold`);
            if (shape.fontStyle === "italic") style.push(`font-style: italic`);
            if (shape.textDecoration === "underline")
              style.push(`text-decoration: underline`);
            if (shape.textAlign) style.push(`text-align: ${shape.textAlign}`);
            return `<p class="${classes.join(" ")}" style="${style.join(
              "; "
            )}">${shape.text || ""}</p>`;

          case "line": {
            const points = shape.points || [0, 0, 100, 100];
            const width = Math.abs(points[2] - points[0]);
            const height = Math.abs(points[3] - points[1]);
            style.push(`width: ${width}px`);
            style.push(`height: ${height}px`);
            style.push(`position: absolute`);
            style.push(`left: ${Math.min(points[0], points[2])}px`);
            style.push(`top: ${Math.min(points[1], points[3])}px`);
            return `
            <svg class="${classes.join(" ")}" style="${style.join("; ")}">
              <line 
                x1="${points[0] - Math.min(points[0], points[2])}" 
                y1="${points[1] - Math.min(points[1], points[3])}"
                x2="${points[2] - Math.min(points[0], points[2])}"
                y2="${points[3] - Math.min(points[1], points[3])}"
                stroke="${shape.stroke || "#000"}"
                stroke-width="${shape.strokeWidth || 2}"
              />
            </svg>`;
          }
          case "image":
            style.push(`width: ${shape.width}px`);
            style.push(`height: ${shape.height}px`);
            style.push(`object-fit: contain`);
            return `<img src="${shape.src || ""}" class="${classes.join(
              " "
            )}" style="${style.join("; ")}" alt="Imported image"/>`;

          default:
            return "";
        }
      })
      .join("\n    ");

    // Generar metadata del componente
    const metadata = {
      selector: `app-${className.toLowerCase()}`,
      standalone: true,
      imports: shapes.some((shape) => shape.type === "text")
        ? "CommonModule"
        : undefined,
      template: `
    <div class="container"${
      isPage ? "" : ' [style.width.px]="width" [style.height.px]="height"'
    }>
      ${template}
    </div>`,
      styles: [
        `
    .container {
      position: ${isPage ? "relative" : "absolute"};
      ${
        isPage
          ? `
      width: ${stageSize.width}px;
      height: ${stageSize.height}px;
      `
          : `
      width: 100%;
      height: 100%;
      `
      }
      overflow: hidden;
      background-color: #f8f9fa;
    }
    
    .shape {
      position: absolute;
    }
  `,
      ],
    };

    // Generar código final
    return `${imports}
@Component({
  selector: '${metadata.selector}',
  standalone: true,
  ${metadata.imports ? `imports: [${metadata.imports}],` : ""}
  template: \`${metadata.template}\`,
  styles: [\`${metadata.styles}\`]
})
export class ${className} {
  ${
    isPage
      ? ""
      : `@Input() width: number = ${stageSize.width};
  @Input() height: number = ${stageSize.height};`
  }
}`;
  };

  const handleExport = () => {
    const code = generateAngularCode();
    const fileName =
      exportMode === "page"
        ? "canvas-page.component.ts"
        : `${componentName.toLowerCase()}.component.ts`;

    const blob = new Blob([code], { type: "text/typescript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="bg-green p-4 rounded-xl shadow-xs border border-gray-200">
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
          Exportar a Angular
        </label>

        <div className="space-y-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setExportMode("component")}
              className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                exportMode === "component"
                  ? "bg-blue-500 text-green"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Como Componente
            </button>
            <button
              onClick={() => setExportMode("page")}
              className={`flex-1 py-2 px-3 text-sm rounded-lg ${
                exportMode === "page"
                  ? "bg-blue-500 text-green"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Como Página
            </button>
          </div>

          {exportMode === "component" && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">
                Nombre del Componente
              </label>
              <input
                type="text"
                value={componentName}
                onChange={(e) =>
                  setComponentName(e.target.value.replace(/[^a-zA-Z]/g, ""))
                }
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="NombreComponente"
              />
            </div>
          )}

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-green rounded-lg"
          >
            <DownloadIcon size={16} />
            <span>Exportar Componente Angular</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {shapes.length} elementos · {stageSize.width}x{stageSize.height}px
      </div>
    </div>
  );
};

export default AngularExporter;
