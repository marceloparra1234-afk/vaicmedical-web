"use client";

import { useEffect, useRef } from "react";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
};

const fontSizes = [
  { label: "12", value: "2" },
  { label: "14", value: "3" },
  { label: "18", value: "4" },
  { label: "24", value: "5" },
  { label: "32", value: "6" },
  { label: "40", value: "7" },
];

export function RichTextEditor({
  label,
  value,
  onChange,
  minHeight = "120px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  }

  function createLink() {
    const href = window.prompt("Ingresa la URL del enlace:");
    if (href) runCommand("createLink", href);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[#34466f]">{label}</p>
      <div className="mt-2 overflow-hidden rounded-lg border border-[#d7e9ef] bg-white focus-within:border-[#58c3de]">
        <div className="flex flex-wrap gap-1 border-b border-[#d7e9ef] bg-[#f7fafb] p-2">
          <select
            aria-label="Tipo de fuente"
            className="h-8 rounded border border-[#d7e9ef] bg-white px-2 text-xs"
            defaultValue="Arial"
            onChange={(event) => runCommand("fontName", event.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
          </select>
          <select
            aria-label="Tamaño de fuente"
            className="h-8 rounded border border-[#d7e9ef] bg-white px-2 text-xs"
            defaultValue="3"
            onChange={(event) => runCommand("fontSize", event.target.value)}
          >
            {fontSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>

          <ToolbarButton command="bold" label="Negrita" onRun={runCommand}>
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton command="italic" label="Cursiva" onRun={runCommand}>
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton command="underline" label="Subrayado" onRun={runCommand}>
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton command="strikeThrough" label="Tachado" onRun={runCommand}>
            <s>S</s>
          </ToolbarButton>

          <ColorControl
            label="Color del texto"
            onChange={(color) => runCommand("foreColor", color)}
          />
          <ColorControl
            label="Color de resaltado"
            onChange={(color) => runCommand("hiliteColor", color)}
            value="#fff176"
          />

          <ToolbarButton
            command="insertUnorderedList"
            label="Lista con viñetas"
            onRun={runCommand}
          >
            • Lista
          </ToolbarButton>
          <ToolbarButton
            command="insertOrderedList"
            label="Lista numerada"
            onRun={runCommand}
          >
            1. Lista
          </ToolbarButton>
          <ToolbarButton command="justifyLeft" label="Alinear izquierda" onRun={runCommand}>
            ≡←
          </ToolbarButton>
          <ToolbarButton command="justifyCenter" label="Centrar" onRun={runCommand}>
            ≡
          </ToolbarButton>
          <ToolbarButton command="justifyRight" label="Alinear derecha" onRun={runCommand}>
            →≡
          </ToolbarButton>
          <ToolbarButton command="justifyFull" label="Justificar" onRun={runCommand}>
            ☰
          </ToolbarButton>
          <ToolbarButton command="outdent" label="Reducir sangría" onRun={runCommand}>
            ←
          </ToolbarButton>
          <ToolbarButton command="indent" label="Aumentar sangría" onRun={runCommand}>
            →
          </ToolbarButton>
          <button
            className="h-8 rounded border border-[#d7e9ef] bg-white px-2 text-xs font-semibold hover:border-[#58c3de]"
            onClick={createLink}
            title="Insertar enlace"
            type="button"
          >
            Enlace
          </button>
          <ToolbarButton command="unlink" label="Quitar enlace" onRun={runCommand}>
            Sin enlace
          </ToolbarButton>
          <ToolbarButton command="removeFormat" label="Limpiar formato" onRun={runCommand}>
            Limpiar
          </ToolbarButton>
        </div>

        <div
          className="rich-editor-content p-3 text-sm leading-6 outline-none"
          contentEditable
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          ref={editorRef}
          style={{ minHeight }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  command,
  label,
  onRun,
  children,
}: {
  command: string;
  label: string;
  onRun: (command: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="h-8 rounded border border-[#d7e9ef] bg-white px-2 text-xs font-semibold hover:border-[#58c3de]"
      onClick={() => onRun(command)}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function ColorControl({
  label,
  onChange,
  value = "#213255",
}: {
  label: string;
  onChange: (color: string) => void;
  value?: string;
}) {
  return (
    <label
      className="grid h-8 w-9 cursor-pointer place-items-center rounded border border-[#d7e9ef] bg-white"
      title={label}
    >
      <input
        className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
        defaultValue={value}
        onChange={(event) => onChange(event.target.value)}
        type="color"
      />
    </label>
  );
}
