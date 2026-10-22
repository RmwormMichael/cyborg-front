import type { Jornada } from '../../types/jornada';
import { ETIQUETAS_PERSONA } from '../../types/jornada';
import { formatearMoneda } from '../../utils/format';
import { calcularTotales } from '../../utils/jornadas';
import {
  CashIcon,
  CheckIcon,
  InfoIcon,
  NoteIcon,
  PencilIcon,
  RouteIcon,
} from '../ui/Icons';

interface JornadaReadViewProps {
  jornada: Jornada;
  errorGuardado: string;
  mensajeExito: string;
  onEditar: () => void;
}

export function JornadaReadView({
  jornada,
  errorGuardado,
  mensajeExito,
  onEditar,
}: JornadaReadViewProps) {
  const totales = calcularTotales(jornada);
  const nombrePersona = ETIQUETAS_PERSONA[jornada.persona];

  return (
    <div className="jornada-read">
      {errorGuardado ? (
        <div className="form-alert is-error" role="alert">
          <InfoIcon size={14} />
          <div className="form-alert-content">{errorGuardado}</div>
        </div>
      ) : null}

      {mensajeExito ? (
        <div className="form-alert is-success" role="status">
          <CheckIcon size={14} />
          <div className="form-alert-content">{mensajeExito}</div>
        </div>
      ) : null}

      <div className="detail-persona">
        <span className="persona-avatar" aria-hidden="true">
          {nombrePersona.slice(0, 2)}
        </span>
        <div className="persona-copy">
          <span className="persona-label">Conductor</span>
          <span className="persona-name">{nombrePersona}</span>
        </div>
      </div>

      <section
        className="detail-section"
        aria-labelledby="detalle-ingresos-title"
      >
        <div className="detail-section-head">
          <h3 id="detalle-ingresos-title" className="detail-section-title">
            Ingresos
          </h3>
          <span className="detail-section-amount">
            {formatearMoneda(totales.ingresosTotales)}
          </span>
        </div>

        <ul className="detail-list">
          <li>
            <span className="detail-list-label">
              <CashIcon size={13} />
              Efectivo
            </span>
            <span className="detail-list-value">
              {formatearMoneda(jornada.ingresos.efectivo)}
            </span>
          </li>
          <li>
            <span className="detail-list-label">
              <RouteIcon size={13} />
              Uber
            </span>
            <span className="detail-list-value">
              {formatearMoneda(jornada.ingresos.uber)}
            </span>
          </li>
        </ul>
      </section>

      <section
        className="detail-section"
        aria-labelledby="detalle-gastos-title"
      >
        <div className="detail-section-head">
          <h3 id="detalle-gastos-title" className="detail-section-title">
            Gastos
            <span className="section-count">{jornada.gastos.length}</span>
          </h3>
          <span className="detail-section-amount">
            {formatearMoneda(totales.gastosTotales)}
          </span>
        </div>

        {jornada.gastos.length > 0 ? (
          <ul className="expense-list">
            {jornada.gastos.map((gasto) => (
              <li key={gasto.id} className="expense-item">
                <span className="expense-concept">{gasto.concepto}</span>
                <span className="expense-value">
                  {formatearMoneda(gasto.valor)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="detail-inline-empty">Sin gastos registrados.</p>
        )}
      </section>

      <div
        className="detail-totals"
        aria-label="Totales de la jornada"
      >
        <div className="detail-total">
          <span>Ingresos</span>
          <strong>{formatearMoneda(totales.ingresosTotales)}</strong>
        </div>
        <div className="detail-total">
          <span>Gastos</span>
          <strong>{formatearMoneda(totales.gastosTotales)}</strong>
        </div>
        <div
          className={`detail-total${
            totales.gananciaNeta < 0 ? ' is-negative' : ''
          }`}
        >
          <span>Ganancia neta</span>
          <strong>{formatearMoneda(totales.gananciaNeta)}</strong>
        </div>
      </div>

      <section
        className="detail-section"
        aria-labelledby="detalle-observaciones-title"
      >
        <div className="detail-section-head">
          <h3
            id="detalle-observaciones-title"
            className="detail-section-title"
          >
            Observaciones
          </h3>
        </div>

        {jornada.observaciones ? (
          <div className="detail-note detail-note-read">
            <NoteIcon size={14} />
            <div>
              <span>Notas de la jornada</span>
              <p>{jornada.observaciones}</p>
            </div>
          </div>
        ) : (
          <p className="detail-inline-empty">Sin observaciones.</p>
        )}
      </section>

      <button
        type="button"
        className="primary-button detail-edit-button"
        onClick={onEditar}
      >
        <PencilIcon size={13} />
        Editar
      </button>
    </div>
  );
}
