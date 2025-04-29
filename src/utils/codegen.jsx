// utils/codegen.js
const styleToCss = (style = {}) =>
  Object.entries(style)
    .map(
      ([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`
    )
    .join(";");

const generateNodeHtml = (node) => {
  const { style = {} } = node.data;
  const baseStyle = {
    position: "absolute",
    left: `${node.position.x}px`,
    top: `${node.position.y}px`,
    ...style,
  };

  switch (node.type) {
    case "rectangle":
      return `<div class="node-${node.id}" style="${styleToCss(baseStyle)}">${
        node.data.label || ""
      }</div>`;
    case "circle":
      return `<div class="node-${node.id}" style="${styleToCss({
        ...baseStyle,
        borderRadius: "50%",
      })}">${node.data.label || ""}</div>`;
    case "text":
      return `<p class="node-${node.id}" style="${styleToCss(baseStyle)}">${
        node.data.text || node.data.label || ""
      }</p>`;
    case "image":
      return `<img class="node-${node.id}" src="${
        node.data.src || "placeholder.jpg"
      }" style="${styleToCss(baseStyle)}" alt="${node.data.label || ""}"/>`;
    case "button":
      return `<button class="node-${node.id}" style="${styleToCss(
        baseStyle
      )}">${node.data.text || node.data.label || "Button"}</button>`;
    case "header":
      return `
        <header class="node-${node.id}" style="${styleToCss(baseStyle)}">
          ${
            node.data.logo
              ? `<img src="${node.data.logo}" class="logo" alt="Logo"/>`
              : ""
          }
          <nav>
            ${(node.data.navItems || [])
              .map((item) => `<a href="#">${item}</a>`)
              .join("")}
          </nav>
        </header>
      `;
    case "loginForm":
      return `
        <div class="node-${node.id} login-form" style="${styleToCss(
        baseStyle
      )}">
          ${
            node.data.showLogo
              ? `<img src="${
                  node.data.logo || "logo-placeholder.png"
                }" class="form-logo" alt="Logo"/>`
              : ""
          }
          <h2>${node.data.title || "Login"}</h2>
          <form>
            ${(node.data.fields || [])
              .map(
                (field) => `
              <div class="form-field">
                <label>${field.label}</label>
                <input type="${field.type}" placeholder="${field.placeholder}"/>
              </div>
            `
              )
              .join("")}
            <button type="submit" style="background-color: ${
              node.data.buttonColor || "#3b82f6"
            }">
              ${node.data.buttonText || "Sign In"}
            </button>
          </form>
        </div>
      `;
    default:
      return "";
  }
};

export const generateFullPage = (nodes = []) => {
  const htmlNodes = nodes.map(generateNodeHtml).join("\n");
  const css = nodes
    .map((node) => {
      const baseStyle = {
        position: "absolute",
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        ...(node.data.style || {}),
      };

      return `.node-${node.id} { ${styleToCss(baseStyle)} }`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Canvas</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      position: relative;
      min-height: 100vh;
    }
    ${css}
    .login-form {
      display: flex;
      flex-direction: column;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .form-field {
      margin-bottom: 15px;
    }
    header {
      display: flex;
      align-items: center;
      padding: 0 20px;
    }
    nav a {
      margin-right: 15px;
      text-decoration: none;
      color: inherit;
    }
  </style>
</head>
<body>
  ${htmlNodes}
  <script>
    // JavaScript adicional puede ir aquí
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Page loaded');
    });
  </script>
</body>
</html>`;
};

export const nodesToHtml = (nodes = []) => generateFullPage(nodes);
export const nodeToHtml = (node) => generateNodeHtml(node);
export const generateHtml = (nodes = []) => {
  const html = generateFullPage(nodes);
  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
};
