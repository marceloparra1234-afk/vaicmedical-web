const metrics = [
  {
    label: "Visualizaciones de página",
    value: "0",
    detail: "Se activará al conectar analítica",
  },
  {
    label: "Producto más visto",
    value: "Sin datos",
    detail: "Se calculará desde las fichas de producto",
  },
  {
    label: "Formularios recibidos",
    value: "0",
    detail: "Pendiente de conectar el formulario",
  },
  {
    label: "Formularios respondidos",
    value: "0",
    detail: "Disponible al crear seguimiento comercial",
  },
];

export function AdminDashboard() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeading
        eyebrow="Panel de rendimiento"
        title="Resumen general del sitio"
        text="Esta vista queda preparada para recibir métricas reales cuando conectemos analítica, formularios y seguimiento de respuestas."
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article
            className="rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold text-[#667085]">
                {metric.label}
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eaf8fc] font-mono text-xs font-bold text-[#58c3de]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-6 text-3xl font-bold text-[#213255]">
              {metric.value}
            </p>
            <p className="mt-3 text-xs leading-5 text-[#667085]">
              {metric.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Actividad del sitio</h2>
              <p className="mt-1 text-sm text-[#667085]">
                Visualizaciones de los últimos 30 días
              </p>
            </div>
            <span className="rounded-lg bg-[#eef5f7] px-3 py-2 text-xs font-semibold text-[#667085]">
              Datos pendientes
            </span>
          </div>
          <div className="mt-8 flex h-64 items-end gap-3 border-b border-l border-[#d7e9ef] px-5 pb-4">
            {[28, 46, 34, 62, 52, 78, 68, 88, 64, 92, 76, 96].map(
              (height, index) => (
                <div
                  className="flex-1 rounded-t bg-[#58c3de]/35"
                  key={`${height}-${index}`}
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
        </article>

        <article className="rounded-xl border border-[#d7e9ef] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Acceso al panel</h2>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            El permiso para visualizar rendimiento podrá asignarse por usuario
            o rol.
          </p>
          <div className="mt-6 rounded-lg border border-[#bdebf3] bg-[#eefafd] p-5">
            <p className="text-sm font-bold">Permiso requerido</p>
            <code className="mt-2 block text-xs text-[#34466f]">
              analytics.view
            </code>
          </div>
        </article>
      </section>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#58c3de]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[#213255]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#667085]">{text}</p>
    </div>
  );
}
