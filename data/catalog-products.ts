export type CatalogDocument = {
  name: string;
  url: string | null;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  brand: string;
  model: string;
  internalCode: string;
  tags: string;
  image: string;
  gallery: string[];
  documents: {
    technicalSheet: CatalogDocument | null;
    manual: CatalogDocument | null;
    certificates: CatalogDocument | null;
    brochure: CatalogDocument | null;
  };
};

export type CatalogLine = {
  id: string;
  name: string;
  description: string;
  summary: string;
  products: CatalogProduct[];
};

const emptyDocuments: CatalogProduct["documents"] = {
  technicalSheet: null,
  manual: null,
  certificates: null,
  brochure: null,
};

const serviceGallery = ["/medical-dashboard.svg", "/blog-article.svg"];
const monitoringGallery = ["/service-maintenance.svg", "/blog-article.svg"];

export const catalogLines: CatalogLine[] = [
  {
    id: "camas-camillas",
    name: "Camas clínicas y camillas",
    description:
      "Equipos de traslado, hospitalización y apoyo diario para servicios clínicos.",
    summary:
      "Mantención, diagnóstico y reparación de sistemas mecánicos y eléctricos.",
    products: [
      {
        slug: "camas-clinicas-electricas",
        name: "Camas clínicas eléctricas",
        type: "Equipo clínico",
        description:
          "Revisión de actuadores, barandas, controles, ruedas, frenos y sistemas de elevación.",
        longDescription:
          "Servicio técnico orientado a recuperar la operación segura y confiable de camas clínicas eléctricas. Evaluamos sus sistemas mecánicos, eléctricos y de control, identificamos fallas y documentamos cada intervención realizada.",
        brand: "Multimarca",
        model: "Según equipo",
        internalCode: "VM-CCE-001",
        tags: "Mantención, reparación, diagnóstico",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "camillas-de-traslado",
        name: "Camillas de traslado",
        type: "Traslado",
        description:
          "Ajuste de estructura, ruedas, frenos, barandas y mecanismos de altura o respaldo.",
        longDescription:
          "Inspeccionamos y reparamos los componentes que permiten el traslado seguro de pacientes, incluyendo estructura, movilidad, frenos, barandas y mecanismos de posicionamiento.",
        brand: "Multimarca",
        model: "Según equipo",
        internalCode: "VM-CT-002",
        tags: "Traslado, seguridad, reparación",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "barandas-y-accesorios",
        name: "Barandas y accesorios",
        type: "Componente",
        description:
          "Evaluación y reposición de piezas asociadas a seguridad, fijación y operación.",
        longDescription:
          "Reparamos, ajustamos y evaluamos barandas y accesorios clínicos para recuperar su fijación, movimiento y funcionamiento seguro.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-BA-003",
        tags: "Accesorios, seguridad, repuestos",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
    ],
  },
  {
    id: "pabellon-procedimientos",
    name: "Pabellón y procedimientos",
    description:
      "Soporte técnico para equipos usados en pabellones, unidades críticas y salas de procedimiento.",
    summary:
      "Trabajo técnico sobre equipos que requieren continuidad, precisión y seguridad.",
    products: [
      {
        slug: "mesas-quirurgicas",
        name: "Mesas quirúrgicas",
        type: "Pabellón",
        description:
          "Diagnóstico de movimientos, controles, columnas, bases, frenos y módulos de operación.",
        longDescription:
          "Realizamos diagnóstico y reparación de mesas quirúrgicas, considerando sus sistemas de movimiento, control, estabilidad y posicionamiento.",
        brand: "Multimarca",
        model: "Según equipo",
        internalCode: "VM-MQ-004",
        tags: "Pabellón, precisión, reparación",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "lamparas-quirurgicas",
        name: "Lámparas quirúrgicas",
        type: "Iluminación",
        description:
          "Revisión de brazos, cabezales, intensidad lumínica, alimentación y conexiones.",
        longDescription:
          "Evaluamos el funcionamiento mecánico, eléctrico y lumínico de lámparas quirúrgicas para mantener su estabilidad y desempeño durante procedimientos.",
        brand: "Multimarca",
        model: "Según equipo",
        internalCode: "VM-LQ-005",
        tags: "Iluminación, pabellón, mantención",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "brazos-y-soportes",
        name: "Brazos y soportes",
        type: "Accesorio",
        description:
          "Ajuste de articulaciones, fijaciones, estabilidad y funcionamiento de componentes móviles.",
        longDescription:
          "Intervenimos brazos y soportes clínicos para recuperar estabilidad, movimiento controlado y fijación segura.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-BS-006",
        tags: "Soportes, ajuste, seguridad",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
    ],
  },
  {
    id: "monitoreo-equipos",
    name: "Monitoreo y equipos clínicos",
    description:
      "Revisión técnica de equipos de apoyo clínico, monitoreo y continuidad asistencial.",
    summary:
      "Inspección, evaluación funcional y reparación según condiciones de uso.",
    products: [
      {
        slug: "monitores-multiparametros",
        name: "Monitores multiparámetros",
        type: "Monitoreo",
        description:
          "Evaluación de funcionamiento, conectores, módulos, alarmas, fuentes y accesorios.",
        longDescription:
          "Diagnosticamos fallas funcionales y de alimentación en monitores multiparámetros, considerando módulos, conectores, alarmas y accesorios asociados.",
        brand: "Multimarca",
        model: "Según equipo",
        internalCode: "VM-MM-007",
        tags: "Monitoreo, diagnóstico, reparación",
        image: "/medical-dashboard.svg",
        gallery: monitoringGallery,
        documents: emptyDocuments,
      },
      {
        slug: "cables-y-sensores",
        name: "Cables y sensores",
        type: "Accesorio",
        description:
          "Revisión de continuidad, conectividad, desgaste físico y compatibilidad operativa.",
        longDescription:
          "Revisamos cables y sensores para identificar daños físicos, problemas de continuidad y condiciones que afecten su uso seguro.",
        brand: "Multimarca",
        model: "Según accesorio",
        internalCode: "VM-CS-008",
        tags: "Accesorios, conectividad, revisión",
        image: "/medical-dashboard.svg",
        gallery: monitoringGallery,
        documents: emptyDocuments,
      },
      {
        slug: "fuentes-y-modulos",
        name: "Fuentes y módulos",
        type: "Componente",
        description:
          "Diagnóstico de alimentación, módulos internos y fallas asociadas a operación.",
        longDescription:
          "Evaluamos fuentes de poder y módulos internos para determinar fallas, posibilidades de reparación y alternativas de reposición.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-FM-009",
        tags: "Electrónica, módulos, diagnóstico",
        image: "/medical-dashboard.svg",
        gallery: monitoringGallery,
        documents: emptyDocuments,
      },
    ],
  },
  {
    id: "repuestos-soporte",
    name: "Repuestos y soporte técnico",
    description:
      "Componentes y apoyo técnico para extender la vida útil de equipos médicos esenciales.",
    summary:
      "Gestión de repuestos, informes técnicos y recomendaciones de continuidad.",
    products: [
      {
        slug: "actuadores-y-motores",
        name: "Actuadores y motores",
        type: "Repuesto",
        description:
          "Componentes para sistemas de elevación, respaldo, inclinación y ajuste de equipos.",
        longDescription:
          "Diagnosticamos y gestionamos actuadores y motores destinados a recuperar movimientos y ajustes esenciales de equipos clínicos.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-AM-010",
        tags: "Repuestos, movimiento, reparación",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "controles-y-botoneras",
        name: "Controles y botoneras",
        type: "Control",
        description:
          "Revisión o reposición de mandos, placas, cables y puntos de operación del usuario.",
        longDescription:
          "Revisamos controles y botoneras para recuperar la operación de movimientos, funciones y comandos del equipo.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-CB-011",
        tags: "Controles, electrónica, repuestos",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
      {
        slug: "ruedas-y-frenos",
        name: "Ruedas y frenos",
        type: "Movilidad",
        description:
          "Componentes para traslado seguro, bloqueo, estabilidad y maniobrabilidad.",
        longDescription:
          "Evaluamos, ajustamos y gestionamos ruedas y frenos para recuperar movilidad, estabilidad y bloqueo seguro.",
        brand: "Multimarca",
        model: "Según componente",
        internalCode: "VM-RF-012",
        tags: "Movilidad, seguridad, repuestos",
        image: "/service-maintenance.svg",
        gallery: serviceGallery,
        documents: emptyDocuments,
      },
    ],
  },
];

export function findCatalogProduct(slug: string) {
  for (const line of catalogLines) {
    const product = line.products.find((item) => item.slug === slug);
    if (product) return { line, product };
  }

  return null;
}
