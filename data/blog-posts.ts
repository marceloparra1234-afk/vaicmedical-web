export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "senales-desgaste-camas-clinicas",
    title: "Señales de desgaste en camas clínicas antes de una falla crítica",
    date: "05 junio 2026",
    excerpt:
      "Una revisión temprana permite detectar ruidos, bloqueos, movimientos irregulares y componentes que pueden comprometer la continuidad del servicio.",
    image: "/blog-article.svg",
    body: [
      "Las camas clínicas trabajan todos los días bajo exigencias mecánicas, eléctricas y operativas. Por eso, una falla rara vez aparece de la nada: normalmente hay señales previas que conviene observar y documentar.",
      "Entre los indicios más frecuentes están los movimientos lentos o intermitentes, ruidos al elevar o reclinar, ruedas con bloqueo irregular, barandas con holgura y controles que responden de forma inconsistente.",
      "Cuando estas señales se reportan a tiempo, el equipo técnico puede priorizar una mantención preventiva o una reparación correctiva antes de que el equipo quede fuera de servicio.",
    ],
  },
  {
    slug: "mantencion-preventiva-camillas",
    title: "Mantención preventiva en camillas: puntos que conviene revisar",
    date: "05 junio 2026",
    excerpt:
      "Ruedas, frenos, estructura, barandas y superficies son puntos clave para mantener camillas seguras y disponibles.",
    image: "/blog-article.svg",
    body: [
      "La camilla es un equipo de alto uso y alto movimiento. Su estado influye directamente en traslados, seguridad del paciente y eficiencia del equipo clínico.",
      "Una mantención preventiva debe revisar frenos, ruedas, barandas, estructura, superficies, mecanismos de altura y puntos de fijación. Cada revisión ayuda a anticipar fallas y reducir tiempos de indisponibilidad.",
      "La trazabilidad del trabajo realizado también importa: registrar hallazgos, acciones y recomendaciones permite tomar mejores decisiones frente a futuras intervenciones.",
    ],
  },
  {
    slug: "documentar-reparaciones-continuidad-tecnica",
    title: "Cómo documentar reparaciones para mejorar la continuidad técnica",
    date: "05 junio 2026",
    excerpt:
      "Un buen informe técnico ayuda a priorizar, comparar fallas, coordinar repuestos y reducir incertidumbre en futuras reparaciones.",
    image: "/blog-article.svg",
    body: [
      "Documentar una reparación no es solo cerrar una solicitud. Es construir memoria técnica sobre el comportamiento del equipo y las decisiones tomadas.",
      "Un informe útil debe incluir identificación del equipo, falla reportada, diagnóstico, acciones realizadas, repuestos utilizados si corresponde, pruebas posteriores y recomendaciones.",
      "Con esta información, las instituciones pueden priorizar mejor, comparar recurrencias y planificar mantenciones con mayor claridad.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
