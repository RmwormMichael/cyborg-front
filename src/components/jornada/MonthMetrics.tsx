import type {
  EstadoCarga,
  IndicadoresMes,
} from '../../types/jornada';
import { formatearEntero, formatearMoneda } from '../../utils/format';
import { KpiCard } from '../ui/KpiCard';
import {
  CalendarCheckIcon,
  InfoIcon,
  ReceiptIcon,
  TrendUpIcon,
  WalletIcon,
} from '../ui/Icons';

interface MonthMetricsProps {
  indicadores: IndicadoresMes;
  diasDelMes: number;
  estado: EstadoCarga;
}

export function MonthMetrics({
  indicadores,
  diasDelMes,
  estado,
}: MonthMetricsProps) {
  const cargando = estado === 'cargando';
  const conError = estado === 'error';
  const valor = (formateado: string): string =>
    cargando ? '…' : conError ? '—' : formateado;
  const detalle = (texto: string): string =>
    cargando ? 'Cargando datos' : conError ? 'No disponible' : texto;

  return (
    <section
      className="metrics"
      aria-labelledby="metrics-title"
      aria-busy={cargando}
    >
      <div className="metrics-head">
        <h2 id="metrics-title" className="sr-only">
          Indicadores del mes
        </h2>
        <span className="metrics-caption">
          <InfoIcon size={13} />
          {cargando
            ? 'Cargando cifras del mes…'
            : conError
              ? 'Cifras no disponibles'
              : 'Cifras calculadas con las jornadas del mes'}
        </span>
      </div>

      <div className="metrics-grid">
        <KpiCard
          etiqueta="Ingresos del mes"
          valor={valor(formatearMoneda(indicadores.ingresosTotales))}
          detalle={detalle('Efectivo y Uber')}
          icono={<WalletIcon size={15} />}
        />
        <KpiCard
          etiqueta="Gastos del mes"
          valor={valor(formatearMoneda(indicadores.gastosTotales))}
          detalle={detalle('Gastos operativos')}
          icono={<ReceiptIcon size={15} />}
        />
        <KpiCard
          etiqueta="Ganancia neta"
          valor={valor(formatearMoneda(indicadores.gananciaNeta))}
          detalle={detalle('Ingresos menos gastos')}
          icono={<TrendUpIcon size={15} />}
          negativo={estado === 'listo' && indicadores.gananciaNeta < 0}
        />
        <KpiCard
          etiqueta="Jornadas registradas"
          valor={valor(formatearEntero(indicadores.jornadas))}
          detalle={detalle(
            `de ${formatearEntero(diasDelMes)} días del mes`,
          )}
          icono={<CalendarCheckIcon size={15} />}
        />
      </div>
    </section>
  );
}
