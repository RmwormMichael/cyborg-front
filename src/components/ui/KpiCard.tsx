import type { ReactNode } from 'react';

interface KpiCardProps {
  etiqueta: string;
  valor: string;
  detalle: string;
  icono: ReactNode;
  negativo?: boolean;
}

export function KpiCard({
  etiqueta,
  valor,
  detalle,
  icono,
  negativo = false,
}: KpiCardProps) {
  return (
    <article
      className={`metric-card${negativo ? ' is-negative' : ''}`}
      aria-label={`${etiqueta}: ${valor}. ${detalle}`}
    >
      <div className="metric-head">
        <span className="metric-label">{etiqueta}</span>
        <span className="metric-icon" aria-hidden="true">
          {icono}
        </span>
      </div>
      <strong className="metric-value" title={valor}>
        {valor}
      </strong>
      <span className="metric-hint">{detalle}</span>
    </article>
  );
}
