import { AdminCreateContent } from "@/components/admin/AdminCreateContent";
import { AdminCatalogManager } from "@/components/admin/AdminCatalogManager";
import { AdminEditorWorkspace } from "@/components/admin/AdminEditorWorkspace";
import { AdminUsers } from "@/components/admin/AdminUsers";

type AdminRouteProps = {
  params: Promise<{ path: string[] }>;
};

const editors: Record<
  string,
  {
    contentKey: string;
    title: string;
    description: string;
    sections: string[];
    previewType?: "page" | "popup";
  }
> = {
  inicio: {
    contentKey: "inicio",
    title: "Editar página de inicio",
    description:
      "Administra el contenido del inicio y revisa cada sección en la vista previa.",
    sections: [
      "Hero principal",
      "Método de trabajo",
      "Nosotros",
      "Servicios",
      "Productos destacados",
      "Noticias destacadas",
      "Contacto",
    ],
  },
  nosotros: {
    contentKey: "nosotros",
    title: "Editar página Nosotros",
    description:
      "Actualiza la presentación de VaicMedical, misión, visión y valores.",
    sections: [
      "Hero principal",
      "Misión y visión",
      "Valores",
      "Llamado a servicios",
    ],
  },
  servicios: {
    contentKey: "servicios",
    title: "Editar página Servicios",
    description:
      "Gestiona la presentación y los bloques de servicios técnicos.",
    sections: [
      "Hero principal",
      "Servicios técnicos",
      "Método de trabajo",
      "Llamado a contacto",
    ],
  },
  blog: {
    contentKey: "blog",
    title: "Editar página Blog",
    description:
      "Gestiona el encabezado, presentación y distribución general del blog.",
    sections: ["Hero principal", "Listado de publicaciones"],
  },
  "catalogo/vista": {
    contentKey: "catalogo",
    title: "Editar página Catálogo",
    description:
      "Administra el encabezado, navegación de líneas y presentación de productos.",
    sections: ["Hero principal", "Navegación de líneas", "Vista de línea"],
  },
  "catalogo/lineas/vista": {
    contentKey: "catalogo-lineas-vista",
    title: "Editar vista de líneas",
    description:
      "Define la estructura visual utilizada para presentar cada línea de productos.",
    sections: ["Título de línea", "Descripción", "Resumen técnico", "Grilla de productos"],
  },
  "catalogo/productos/vista": {
    contentKey: "catalogo-productos-vista",
    title: "Editar vista de producto",
    description:
      "Administra la estructura de ficha, galería, información y documentación.",
    sections: ["Galería", "Información técnica", "Descripción", "Documentación", "Productos relacionados"],
  },
  contacto: {
    contentKey: "contacto",
    title: "Editar página Contacto",
    description:
      "Actualiza los textos, canales de contacto y presentación del formulario.",
    sections: ["Hero principal", "Información de contacto", "Formulario"],
  },
  "ventana-emergente": {
    contentKey: "ventana-emergente",
    title: "Editar ventana emergente",
    description:
      "Configura el contenido y apariencia de la ventana emergente del sitio.",
    sections: ["Configuración"],
    previewType: "popup",
  },
};

export default async function AdminModulePage({ params }: AdminRouteProps) {
  const { path } = await params;
  const route = path.join("/");

  if (route === "blog/crear") {
    return <AdminCreateContent type="blog" />;
  }

  if (route === "catalogo/lineas/crear") {
    return <AdminCreateContent type="line" />;
  }

  if (route === "catalogo/productos/crear") {
    return <AdminCreateContent type="product" />;
  }

  if (route === "catalogo") {
    return <AdminCatalogManager />;
  }

  if (route === "usuarios") {
    return <AdminUsers />;
  }

  const editor = editors[route];

  if (editor) {
    return <AdminEditorWorkspace {...editor} />;
  }

  return (
    <div className="rounded-xl border border-[#d7e9ef] bg-white p-8">
      <h1 className="text-2xl font-bold">Módulo en preparación</h1>
      <p className="mt-3 text-sm text-[#667085]">
        Esta sección será configurada durante la siguiente etapa del editor.
      </p>
    </div>
  );
}
