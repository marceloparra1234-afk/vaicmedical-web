const posts = [
  "Señales de desgaste en camas clínicas antes de una falla crítica",
  "Mantención preventiva en camillas: puntos que conviene revisar",
  "Cómo documentar reparaciones para mejorar la continuidad técnica",
];

export default function BlogPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
          Blog
        </p>
        <h1 className="mt-3 max-w-5xl text-6xl font-semibold leading-tight sm:text-7xl">
          Contenido técnico para cuidar equipos médicos y reducir fallas.
        </h1>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post}
            className="rounded-2xl border border-[#d7e9ef] bg-white p-7 shadow-sm"
          >
            <p className="font-mono text-xs font-semibold text-[#58c3de]">
              VAIC INSIGHTS
            </p>
            <h2 className="mt-5 text-xl font-semibold leading-7">{post}</h2>
            <p className="mt-5 text-sm font-semibold text-[#34466f]">
              Próximamente
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
