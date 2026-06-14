"use client";

import { useEffect, useRef } from "react";
import { useVisualPalette } from "@/components/admin/use-visual-palette";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
};

const textStyles = [
  { label: "Párrafo", value: "p" },
  { label: "Subtítulo", value: "h3" },
  { label: "Título", value: "h2" },
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
            aria-label="Estilo del texto"
            className="h-9 rounded border border-[#d7e9ef] bg-white px-2 text-xs font-semibold"
            defaultValue="p"
            onChange={(event) => runCommand("formatBlock", event.target.value)}
            title="Estilo del texto"
          >
            {textStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>

          <ToolbarButton command="undo" label="Deshacer" onRun={runCommand}>↶</ToolbarButton>
          <ToolbarButton command="redo" label="Rehacer" onRun={runCommand}>↷</ToolbarButton>
          <ToolbarButton command="bold" label="Negrita" onRun={runCommand}>
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton command="italic" label="Cursiva" onRun={runCommand}>
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton command="underline" label="Subrayado" onRun={runCommand}>
            <u>U</u>
          </ToolbarButton>
          <ColorControl
            label="Color del texto"
            onChange={(color) => runCommand("foreColor", color)}
            onRemove={() => runCommand("removeFormat")}
          />
          <ColorControl
            label="Color de resaltado"
            onChange={(color) => runCommand("hiliteColor", color)}
            onRemove={() => runCommand("hiliteColor", "transparent")}
            value="#eaf8fc"
          />

          <ToolbarButton
            command="insertUnorderedList"
            label="Lista con viñetas"
            onRun={runCommand}
          >
            •
          </ToolbarButton>
          <ToolbarButton
            command="insertOrderedList"
            label="Lista numerada"
            onRun={runCommand}
          >
            1.
          </ToolbarButton>
          <ToolbarButton command="justifyLeft" label="Alinear izquierda" onRun={runCommand}>
            ≡
          </ToolbarButton>
          <ToolbarButton command="justifyCenter" label="Centrar" onRun={runCommand}>
            ≣
          </ToolbarButton>
          <ToolbarButton command="justifyRight" label="Alinear derecha" onRun={runCommand}>
            ≡
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
            ⛓
          </ToolbarButton>
          <ToolbarButton command="removeFormat" label="Limpiar formato" onRun={runCommand}>
            Quitar formato
          </ToolbarButton>
        </div>

        <div
          autoCorrect="on"
          className="rich-editor-content p-3 text-sm leading-6 outline-none"
          contentEditable
          lang="es"
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          ref={editorRef}
          spellCheck
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
      aria-label={label}
      className="h-9 min-w-9 rounded border border-[#d7e9ef] bg-white px-2 text-xs font-semibold hover:border-[#58c3de]"
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
  onRemove,
  value = "#213255",
}: {
  label: string;
  onChange: (color: string) => void;
  onRemove: () => void;
  value?: string;
}) {
  const palette = useVisualPalette();
  return (
    <label
      className="grid cursor-pointer place-items-center rounded border border-[#d7e9ef] bg-white"
      title={label}
    >
      <select
        aria-label={label}
        className="h-8 w-28 bg-transparent px-2 text-xs"
        defaultValue={value}
        onChange={(event) =>
          event.target.value === "remove" ? onRemove() : onChange(event.target.value)
        }
      >
        <option value="remove">Quitar</option>
        {palette.filter((color) => color.hex !== "transparent").map((color) => (
          <option key={color.hex} value={color.hex}>
            {color.name} · {color.hex}
          </option>
        ))}
      </select>
    </label>
  );
}
