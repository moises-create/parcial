import React, { useState } from "react";
import { X, Copy, Code, FileText, Cpu, Package } from "react-feather";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Función para convertir nodos a componentes Angular
const nodesToAngular = (nodes) => {
  // Estructura base del proyecto Angular
  const angularProject = {
    components: {},
    app: {
      html: `<div class="container">\n  <!-- Componentes generados -->\n`,
      ts: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-root',\n  templateUrl: './app.component.html',\n  styleUrls: ['./app.component.scss']\n})\nexport class AppComponent {\n  title = 'canvas-export';\n}\n`,
      scss: `/* Estilos globales */\n.container {\n  position: relative;\n  width: 100%;\n  height: 100vh;\n}\n`,
    },
  };

  // Generar componentes para cada nodo
  nodes.forEach((node) => {
    const componentName = `${node.type}-component`;
    const selector = `app-${node.type}`;

    // HTML del componente
    let componentHtml = "";
    let componentTs = "";
    let componentScss = "";

    switch (node.type) {
      case "text":
        componentHtml = `<div class="text-component" [ngStyle]="style">\n  {{ text }}\n</div>`;
        componentTs = `import { Component, Input } from '@angular/core';\n\n@Component({\n  selector: '${selector}',\n  templateUrl: './${componentName}.component.html',\n  styleUrls: ['./${componentName}.component.scss']\n})\nexport class ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        } {\n  @Input() text: string = '${
          node.data.text || node.data.label
        }';\n  @Input() style: any = ${JSON.stringify(
          node.data.style || {}
        )};\n}\n`;
        componentScss = `.text-component {\n  padding: 3px;\n  border-radius: 0.375rem;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n}\n`;
        break;
      case "rectangle":
        componentHtml = `<div class="rectangle-component" [ngStyle]="style">\n  {{ label }}\n</div>`;
        componentTs = `import { Component, Input } from '@angular/core';\n\n@Component({\n  selector: '${selector}',\n  templateUrl: './${componentName}.component.html',\n  styleUrls: ['./${componentName}.component.scss']\n})\nexport class ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        } {\n  @Input() label: string = '${
          node.data.label
        }';\n  @Input() style: any = ${JSON.stringify(
          node.data.style || {}
        )};\n}\n`;
        componentScss = `.rectangle-component {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.375rem;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n}\n`;
        break;
      // Añadir más casos para otros tipos de nodos...
      case "button":
        componentHtml = `<button class="button-component" [ngStyle]="style">\n  {{ text }}\n</button>`;
        componentTs = `import { Component, Input, Output, EventEmitter } from '@angular/core';\n\n@Component({\n  selector: '${selector}',\n  templateUrl: './${componentName}.component.html',\n  styleUrls: ['./${componentName}.component.scss']\n})\nexport class ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        } {\n  @Input() text: string = '${
          node.data.text || node.data.label
        }';\n  @Input() style: any = ${JSON.stringify(
          node.data.style || {}
        )};\n  @Output() click = new EventEmitter<void>();\n\n  onClick() {\n    this.click.emit();\n  }\n}\n`;
        componentScss = `.button-component {\n  cursor: pointer;\n  border-radius: 0.375rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.3s;\n}\n`;
        break;
      default:
        componentHtml = `<div class="component">{{ label }}</div>`;
        componentTs = `import { Component, Input } from '@angular/core';\n\n@Component({\n  selector: '${selector}',\n  templateUrl: './${componentName}.component.html',\n  styleUrls: ['./${componentName}.component.scss']\n})\nexport class ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        } {\n  @Input() label: string = '${node.data.label}';\n}\n`;
        componentScss = `.component {\n  padding: 10px;\n}\n`;
    }

    // Agregar componente al proyecto
    angularProject.components[componentName] = {
      html: componentHtml,
      ts: componentTs,
      scss: componentScss,
    };

    // Agregar instancia del componente al app.component.html
    const style = {
      position: "absolute",
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      zIndex: nodes.indexOf(node),
    };

    angularProject.app.html += `  <${selector} [style]="${JSON.stringify(
      style
    ).replace(/"/g, "'")}" [text]="${node.data.text || ""}" [label]="${
      node.data.label || ""
    }"></${selector}>\n`;
  });

  angularProject.app.html += `</div>`;

  // Generar module.ts con todos los componentes importados
  let moduleTs = `import { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { AppComponent } from './app.component';\n\n`;

  // Importar componentes
  Object.keys(angularProject.components).forEach((name) => {
    const className = name.charAt(0).toUpperCase() + name.slice(1);
    moduleTs += `import { ${className} } from './${name}/${name}.component';\n`;
  });

  moduleTs += `\n@NgModule({\n  declarations: [\n    AppComponent,\n`;

  // Declarar componentes
  Object.keys(angularProject.components).forEach((name) => {
    const className = name.charAt(0).toUpperCase() + name.slice(1);
    moduleTs += `    ${className},\n`;
  });

  moduleTs += `  ],\n  imports: [\n    BrowserModule\n  ],\n  providers: [],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }\n`;

  angularProject.app.module = moduleTs;

  return angularProject;
};

// Función para crear un archivo ZIP con la estructura del proyecto Angular
const createAngularZip = async (angularProject) => {
  const zip = new JSZip();

  // Crear estructura de carpetas
  const src = zip.folder("src");
  const app = src.folder("app");

  // Añadir archivos principales
  app.file("app.component.html", angularProject.app.html);
  app.file("app.component.ts", angularProject.app.ts);
  app.file("app.component.scss", angularProject.app.scss);
  app.file("app.module.ts", angularProject.app.module);

  // Crear componentes
  Object.keys(angularProject.components).forEach((componentName) => {
    const component = angularProject.components[componentName];
    const componentFolder = app.folder(componentName);
    componentFolder.file(`${componentName}.component.html`, component.html);
    componentFolder.file(`${componentName}.component.ts`, component.ts);
    componentFolder.file(`${componentName}.component.scss`, component.scss);
  });

  // Añadir archivos de configuración básicos
  zip.file(
    "angular.json",
    JSON.stringify(
      {
        $schema: "./node_modules/@angular/cli/lib/config/schema.json",
        version: 1,
        newProjectRoot: "projects",
        projects: {
          "canvas-export": {
            projectType: "application",
            schematics: {
              "@schematics/angular:component": {
                style: "scss",
              },
            },
            root: "",
            sourceRoot: "src",
            prefix: "app",
            architect: {
              build: {
                builder: "@angular-devkit/build-angular:browser",
                options: {
                  outputPath: "dist/canvas-export",
                  index: "src/index.html",
                  main: "src/main.ts",
                  polyfills: ["zone.js"],
                  tsConfig: "tsconfig.app.json",
                  inlineStyleLanguage: "scss",
                  assets: ["src/favicon.ico", "src/assets"],
                  styles: ["src/styles.scss"],
                  scripts: [],
                },
              },
            },
          },
        },
      },
      null,
      2
    )
  );

  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: "canvas-export",
        version: "0.0.0",
        scripts: {
          ng: "ng",
          start: "ng serve",
          build: "ng build",
        },
        private: true,
        dependencies: {
          "@angular/animations": "^16.0.0",
          "@angular/common": "^16.0.0",
          "@angular/compiler": "^16.0.0",
          "@angular/core": "^16.0.0",
          "@angular/forms": "^16.0.0",
          "@angular/platform-browser": "^16.0.0",
          "@angular/platform-browser-dynamic": "^16.0.0",
          "@angular/router": "^16.0.0",
          rxjs: "~7.8.0",
          tslib: "^2.3.0",
          "zone.js": "~0.13.0",
        },
        devDependencies: {
          "@angular-devkit/build-angular": "^16.0.0",
          "@angular/cli": "~16.0.0",
          "@angular/compiler-cli": "^16.0.0",
          typescript: "~5.0.2",
        },
      },
      null,
      2
    )
  );

  // Añadir otros archivos esenciales
  src.file(
    "index.html",
    `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>Canvas Export</title>\n  <base href="/">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="icon" type="image/x-icon" href="favicon.ico">\n</head>\n<body>\n  <app-root></app-root>\n</body>\n</html>\n`
  );

  src.file(
    "main.ts",
    `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app/app.module';\n\nplatformBrowserDynamic().bootstrapModule(AppModule)\n  .catch(err => console.error(err));\n`
  );

  src.file(
    "styles.scss",
    `/* You can add global styles to this file, and also import other style files */\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n`
  );

  // Generar el archivo ZIP
  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
};

const CodeModal = ({ code, onClose, nodes = [] }) => {
  const [activeTab, setActiveTab] = useState("html");

  // Extrae las partes del código (esto es básico, puedes mejorarlo)
  const htmlPart = code.match(/<body>([\s\S]*)<\/body>/)?.[1] || "";
  const cssPart = code.match(/<style>([\s\S]*)<\/style>/)?.[1] || "";
  const jsPart = code.match(/<script>([\s\S]*)<\/script>/)?.[1] || "";

  // Generar código Angular
  const angularProject = nodesToAngular(nodes);

  // Versión simplificada para mostrar en la interfaz
  const angularPreview = `// app.component.html
${angularProject.app.html}

// app.module.ts
${angularProject.app.module.substring(0, 300)}...

// Componentes generados (${Object.keys(angularProject.components).length}):
${Object.keys(angularProject.components)
  .map((name) => `- ${name}`)
  .join("\n")}
`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Puedes agregar una notificación de copiado aquí
  };

  const downloadAngularProject = async () => {
    const blob = await createAngularZip(angularProject);
    saveAs(blob, "angular-project.zip");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[min(90vw,900px)] max-h-[90vh] rounded-lg shadow-xl flex flex-col">
        <header className="p-4 border-b flex items-center">
          <h2 className="font-semibold flex-1">Generated code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </header>

        <div className="border-b flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "html"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("html")}
          >
            <FileText size={16} className="inline mr-1" />
            HTML
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "css"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("css")}
          >
            <Code size={16} className="inline mr-1" />
            CSS
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "js"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("js")}
          >
            <Cpu size={16} className="inline mr-1" />
            JS
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "angular"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("angular")}
          >
            <Package size={16} className="inline mr-1" />
            Angular
          </button>
        </div>

        <pre className="p-4 overflow-auto text-xs flex-1 bg-gray-50">
          <code>
            {activeTab === "html" && htmlPart}
            {activeTab === "css" && cssPart}
            {activeTab === "js" && jsPart}
            {activeTab === "angular" && angularPreview}
          </code>
        </pre>

        <footer className="p-4 border-t flex justify-between">
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
              onClick={() =>
                copyToClipboard(
                  activeTab === "html"
                    ? htmlPart
                    : activeTab === "css"
                    ? cssPart
                    : activeTab === "js"
                    ? jsPart
                    : angularPreview
                )
              }
            >
              <Copy size={16} className="mr-2" />
              Copy {activeTab.toUpperCase()}
            </button>
          </div>
          {activeTab === "angular" ? (
            <button
              className="px-4 py-2 border rounded bg-red-600 text-white"
              onClick={downloadAngularProject}
            >
              Download Angular Project
            </button>
          ) : (
            <button
              className="px-4 py-2 border rounded"
              onClick={() => {
                const blob = new Blob([code], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "canvas-export.html";
                a.click();
              }}
            >
              Download HTML
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default CodeModal;
