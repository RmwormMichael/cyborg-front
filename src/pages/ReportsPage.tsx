import { ChartIcon } from '../components/ui/Icons';

export function ReportsPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">Análisis</span>
          <h1>Reportes</h1>
          <p>
            Una vista dedicada al rendimiento del vehículo por rangos de fecha
            y persona.
          </p>
        </div>
        <span className="status-chip is-empty">Pendiente</span>
      </header>

      <section className="panel placeholder-panel" aria-labelledby="reports-title">
        <span className="placeholder-icon" aria-hidden="true">
          <ChartIcon size={22} />
        </span>
        <span className="placeholder-eyebrow">Vista provisional</span>
        <h2 id="reports-title">Reportes en preparación</h2>
        <p>
          Esta sección mostrará los resúmenes por rango de fechas cuando se
          conecte la API. Todavía no se presentan datos financieros aquí.
        </p>
        <div className="placeholder-tags" aria-label="Contenido previsto">
          <span>Resumen por rango</span>
          <span>Filtro por persona</span>
          <span>Totales y ganancia</span>
        </div>
      </section>
    </>
  );
}
