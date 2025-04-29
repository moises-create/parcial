export const exportToReactComponent = (shapes) => {
  const componentName = `ExportedUI_${Date.now().toString(36)}`;

  const shapeToJSX = (shape) => {
    const baseStyle = {
      position: "absolute",
      left: `${shape.x}px`,
      top: `${shape.y}px`,
      transform: `rotate(${shape.rotation || 0}deg)`,
    };

    switch (shape.type) {
      case "rectangle":
        return `<div style={{
            ...${JSON.stringify(baseStyle)},
            width: '${shape.width}px',
            height: '${shape.height}px',
            backgroundColor: '${shape.fill}',
            borderRadius: '${shape.cornerRadius || 0}px',
            border: '${shape.strokeWidth || 0}px solid ${
          shape.stroke || "transparent"
        }'
          }}></div>`;
      // ... otros casos
    }
  };

  return `import React from 'react';
    
  const ${componentName} = () => {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        ${shapes.map(shapeToJSX).join("\n")}
      </div>
    );
  };
  
  export default ${componentName};`;
};
export const exportToHTML = (shapes, stageSize) => {
  const htmlElements = shapes
    .map((shape) => {
      const baseStyle = `
        position:absolute;
        left:${shape.x}px;
        top:${shape.y}px;
        transform: rotate(${shape.rotation || 0}deg);
        transform-origin: center;
      `;

      switch (shape.type) {
        case "rectangle":
          return `<div style="${baseStyle}
            width:${shape.width}px;
            height:${shape.height}px;
            background:${shape.fill || "#3498db"};
            border: ${shape.strokeWidth || 0}px solid ${
            shape.stroke || "transparent"
          };
          "></div>`;
        case "circle":
          return `<div style="${baseStyle}
            width:${shape.radius * 2}px;
            height:${shape.radius * 2}px;
            border-radius:50%;
            background:${shape.fill || "#3498db"};
            border: ${shape.strokeWidth || 0}px solid ${
            shape.stroke || "transparent"
          };
            transform: translate(-50%, -50%) rotate(${shape.rotation || 0}deg);
          "></div>`;
        case "text":
          return `<p style="${baseStyle}
            font-size:${shape.fontSize || 16}px;
            font-family:${shape.fontFamily || "Arial"};
            color:${shape.fill || "#000"};
            margin:0;
            white-space:nowrap;
          ">${shape.text || ""}</p>`;
        case "image":
          return `<img src="${shape.src}" style="${baseStyle}
            width:${shape.width}px;
            height:${shape.height}px;
            object-fit: contain;
          "/>`;
        case "line":
          // Las líneas son más complejas en HTML puro, podrías usar SVG
          return `<svg style="${baseStyle}" width="100%" height="100%">
            <line 
              x1="0" y1="0" 
              x2="${shape.points[2] - shape.points[0] || 100}" 
              y2="${shape.points[3] - shape.points[1] || 100}"
              stroke="${shape.stroke || "#000"}" 
              stroke-width="${shape.strokeWidth || 2}"
            />
          </svg>`;
        default:
          return "";
      }
    })
    .join("\n");

  const fullHtml = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Exported UI</title>
      <style>
        body {
          margin:0;
          position:relative;
          width:${stageSize.width}px;
          height:${stageSize.height}px;
          overflow:hidden;
          background-color:#f8f9fa;
        }
      </style>
    </head>
    <body>
      ${htmlElements}
    </body>
    </html>`;

  const blob = new Blob([fullHtml], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `canvas-export-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJS = (shapes, stageSize) => {
  const componentName = `ExportedCanvas_${Date.now().toString(36)}`;

  const shapeComponents = shapes
    .map((shape) => {
      const baseStyle = {
        position: "absolute",
        left: `${shape.x}px`,
        top: `${shape.y}px`,
        transform: `rotate(${shape.rotation || 0}deg)`,
        transformOrigin: "center",
      };

      switch (shape.type) {
        case "rectangle":
          return `{
                type: 'div',
                props: {
                  style: {
                    ...${JSON.stringify(baseStyle)},
                    width: '${shape.width}px',
                    height: '${shape.height}px',
                    backgroundColor: '${shape.fill || "#3498db"}',
                    border: '${shape.strokeWidth || 0}px solid ${
            shape.stroke || "transparent"
          }',
                    borderRadius: '${shape.cornerRadius || 0}px'
                  }
                }
              }`;
        case "circle":
          return `{
                type: 'div',
                props: {
                  style: {
                    ...${JSON.stringify(baseStyle)},
                    width: '${shape.radius * 2}px',
                    height: '${shape.radius * 2}px',
                    borderRadius: '50%',
                    backgroundColor: '${shape.fill || "#3498db"}',
                    border: '${shape.strokeWidth || 0}px solid ${
            shape.stroke || "transparent"
          }',
                    transform: 'translate(-50%, -50%) rotate(${
                      shape.rotation || 0
                    }deg)'
                  }
                }
              }`;
        case "text":
          return `{
                type: 'p',
                props: {
                  style: {
                    ...${JSON.stringify(baseStyle)},
                    fontSize: '${shape.fontSize || 16}px',
                    fontFamily: '${shape.fontFamily || "Arial"}',
                    color: '${shape.fill || "#000"}',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    fontWeight: '${shape.fontWeight || "normal"}',
                    fontStyle: '${shape.fontStyle || "normal"}',
                    textDecoration: '${shape.textDecoration || "none"}',
                    textAlign: '${shape.textAlign || "left"}'
                  },
                  children: '${shape.text || ""}'
                }
              }`;
        case "image":
          return `{
                type: 'img',
                props: {
                  src: '${shape.src || ""}',
                  style: {
                    ...${JSON.stringify(baseStyle)},
                    width: '${shape.width}px',
                    height: '${shape.height}px',
                    objectFit: 'contain'
                  },
                  alt: 'Imagen'
                }
              }`;
        case "line":
          return `{
                type: 'svg',
                props: {
                  style: {
                    ...${JSON.stringify(baseStyle)},
                    width: '100%',
                    height: '100%'
                  },
                  children: React.createElement('line', {
                    x1: 0,
                    y1: 0,
                    x2: ${shape.points[2] - shape.points[0] || 100},
                    y2: ${shape.points[3] - shape.points[1] || 100},
                    stroke: '${shape.stroke || "#000"}',
                    strokeWidth: ${shape.strokeWidth || 2}
                  })
                }
              }`;
        default:
          return "";
      }
    })
    .join(",\n");

  const jsCode = `import React from 'react';
      
      const ${componentName} = () => {
        return (
          <div style={{
            position: 'relative',
            width: '${stageSize.width}px',
            height: '${stageSize.height}px',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa'
          }}>
            {[
              ${shapeComponents}
            ].map((element, index) => (
              React.createElement(element.type, {
                ...element.props,
                key: \`shape-\${index}\`
              })
            ))}
          </div>
        );
      };
      
      export default ${componentName};`;

  const blob = new Blob([jsCode], { type: "text/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${componentName}.js`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const importHTML = (shapes, saveChanges, setShapes) => {
  // Crear un input de tipo file
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".html,.htm,.txt";

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const newShapes = parseHTMLToShapes(content);

      if (newShapes.length > 0) {
        const updatedShapes = [...shapes, ...newShapes];
        setShapes(updatedShapes);
        saveChanges(updatedShapes);
      } else {
        alert("No se encontraron elementos HTML compatibles en el archivo");
      }
    } catch (error) {
      console.error("Error al importar HTML:", error);
      alert("Error al procesar el archivo HTML");
    }
  };

  input.click();
};
// Función para convertir HTML a formas del canvas
export const parseHTMLToShapes = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;
  const shapes = [];
  let idCounter = 0;

  // Función recursiva para procesar nodos
  const processNode = (node, parentX = 0, parentY = 0) => {
    if (!node.style) return;

    const style = window.getComputedStyle(node);
    const position = style.position;
    const left = parseInt(style.left) || 0;
    const top = parseInt(style.top) || 0;

    // Calcular posición absoluta considerando el padre
    const x = parentX + left;
    const y = parentY + top;

    // Extraer transform rotate si existe
    const transform = style.transform;
    let rotation = 0;
    if (transform && transform.includes("rotate")) {
      const match = transform.match(/rotate\(([-\d.]+)deg\)/);
      if (match) rotation = parseFloat(match[1]);
    }

    // Crear forma según el tipo de elemento
    const baseShape = {
      id: `imported-${Date.now()}-${idCounter++}`,
      x,
      y,
      rotation,
      fill: style.backgroundColor || "transparent",
      stroke: style.borderColor || "transparent",
      strokeWidth: parseInt(style.borderWidth) || 0,
      draggable: true,
      opacity: parseFloat(style.opacity) || 1,
    };

    // Procesar diferentes tipos de elementos
    if (node.tagName === "DIV") {
      if (style.borderRadius === "50%") {
        // Es un círculo
        shapes.push({
          ...baseShape,
          type: "circle",
          radius: parseInt(style.width) / 2 || 50,
        });
      } else {
        // Es un rectángulo
        shapes.push({
          ...baseShape,
          type: "rectangle",
          width: parseInt(style.width) || 100,
          height: parseInt(style.height) || 100,
          cornerRadius: parseInt(style.borderRadius) || 0,
        });
      }
    } else if (node.tagName === "P" || node.tagName === "SPAN") {
      // Es texto
      shapes.push({
        ...baseShape,
        type: "text",
        text: node.textContent || "",
        fontSize: parseInt(style.fontSize) || 16,
        fontFamily: style.fontFamily || "Arial",
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        textDecoration: style.textDecoration,
        textAlign: style.textAlign,
        fill: style.color || "#000000",
      });
    } else if (node.tagName === "IMG") {
      // Es una imagen
      shapes.push({
        ...baseShape,
        type: "image",
        src: node.src || "",
        width: parseInt(style.width) || 100,
        height: parseInt(style.height) || 100,
      });
    } else if (node.tagName === "SVG") {
      // Procesar SVG (soporte básico para líneas)
      const line = node.querySelector("line");
      if (line) {
        shapes.push({
          ...baseShape,
          type: "line",
          points: [
            parseFloat(line.getAttribute("x1")) || 0,
            parseFloat(line.getAttribute("y1")) || 0,
            parseFloat(line.getAttribute("x2")) || 100,
            parseFloat(line.getAttribute("y2")) || 100,
          ],
          stroke: line.getAttribute("stroke") || "#000000",
          strokeWidth: parseFloat(line.getAttribute("stroke-width")) || 2,
        });
      }
    }

    // Procesar hijos recursivamente
    if (position === "relative" || position === "absolute") {
      Array.from(node.children).forEach((child) => {
        processNode(child, x, y);
      });
    }
  };

  // Procesar todos los nodos hijos del body
  Array.from(body.children).forEach((child) => {
    processNode(child);
  });

  return shapes;
};
