import { AdminCreateContent } from "@/components/admin/AdminCreateContent";
import { AdminEditorWorkspace } from "@/components/admin/AdminEditorWorkspace";
import { AdminUsers } from "@/components/admin/AdminUsers";

type AdminRouteProps = {
  params: Promise<{ path: string[] }>;
};

const editors: Record<
  string,
  {
    title: string;
    description: string;
    sections: string[];
    previewType?: "page" | "popup";
  }
> = {
  inicio: {
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
    title: "Editar página Nosotros",
    description:
      "Actualiza la presentación de VaicMedical, misión, visión y valores.",
    sections: ["Hero", "Presentación", "Misión", "Visión", "Valores VAIC"],
  },
  servicios: {
    title: "Editar página Servicios",
    description:
      "Gestiona la presentación y los bloques de servicios técnicos.",
    sections: [
      "Hero",
      "Mantención preventiva",
      "Reparación correctiva",
      "Soporte técnico",
      "Llamado a contacto",
    ],
  },
  blog: {
    title: "Editar página Blog",
    description:
      "Gestiona el encabezado, presentación y distribución general del blog.",
    sections: ["Encabezado", "Noticias destacadas", "Listado de publicaciones"],
  },
  "blog/vista": {
    title: "Editar vista de publicación",
    description:
      "Define cómo se presenta cada noticia, blog o artículo al cliente.",
    sections: ["Título y fecha", "Breve reseña", "Imagen principal", "Artículo", "Contenido relacionado"],
  },
  catalogo: {
    title: "Editar página Catálogo",
    description:
      "Administra el encabezado, navegación de líneas y presentación de productos.",
    sections: ["Encabezado", "Navegación de líneas", "Bloques de líneas", "Tarjetas de productos"],
  },
  "catalogo/lineas/vista": {
    title: "Editar vista de líneas",
    description:
      "Define la estructura visual utilizada para presentar cada línea de productos.",
    sections: ["Título de línea", "Descripción", "Resumen técnico", "Grilla de productos"],
  },
  "catalogo/productos/vista": {
    title: "Editar vista de producto",
    description:
      "Administra la estructura de ficha, galería, información y documentación.",
    sections: ["Galería", "Información técnica", "Descripción", "Documentación", "Productos relacionados"],
  },
  contacto: {
    title: "Editar página Contacto",
    description:
      "Actualiza los textos, canales de contacto y presentación del formulario.",
    sections: ["Encabezado", "Información de contacto", "Formulario", "Mensaje posterior al envío"],
  },
  "ventana-emergente": {
    title: "Editar ventana emergente",
    description:
      "Configura el contenido y apariencia de la ventana emergente del sitio.",
    sections: ["Configuración", "Imagen", "Título y texto", "Botones", "Frecuencia"],
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
