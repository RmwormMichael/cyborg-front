import { useEffect, useRef, useState } from 'react';
import type {
  DatosJornada,
  EstadoCarga,
  Jornada,
} from '../../types/jornada';
import { formatearFechaLarga } from '../../utils/dates';
import { CalendarOffIcon, InfoIcon } from '../ui/Icons';
import { JornadaForm } from './JornadaForm';
import { JornadaReadView } from './JornadaReadView';

interface DailyDetailPanelProps {
  fecha: string;
  estado: EstadoCarga;
  jornada: Jornada | null;
  errorDetalle: string;
  guardando: boolean;
  guardadoEnOtraFecha: boolean;
  errorGuardado: string;
  mensajeExito: string;
  onGuardar: (datos: DatosJornada) => Promise<boolean>;
  onReintentar: () => void;
}

export function DailyDetailPanel({
  fecha,
  estado,
  jornada,
  errorDetalle,
  guardando,
  guardadoEnOtraFecha,
  errorGuardado,
  mensajeExito,
  onGuardar,
  onReintentar,
}: DailyDetailPanelProps) {
  const [modoEdicion, setModoEdicion] = useState(() => jornada === null);
  const fechaRef = useRef(fecha);

  useEffect(() => {
    fechaRef.current = fecha;
  }, [fecha]);

  useEffect(() => {
    setModoEdicion(jornada === null);
  }, [fecha, jornada?.updatedAt]);

  const etiquetaEstado =
    estado === 'cargando'
      ? 'Cargando'
      : estado === 'error'
        ? 'Error'
        : jornada
          ? modoEdicion
            ? 'Editando'
            : 'Registrada'
          : 'Sin registro';

  const claseEstado =
    estado === 'error'
      ? ' is-error'
      : estado === 'listo' && !jornada
        ? ' is-empty'
        : '';

  async function manejarGuardar(datos: DatosJornada): Promise<void> {
    const fechaGuardada = fecha;
    const guardado = await onGuardar(datos);

    if (guardado && fechaRef.current === fechaGuardada) {
      setModoEdicion(false);
    }
  }

  return (
    <section
      className="panel detail-panel"
      aria-labelledby="detalle-dia-title"
    >
      <header className="detail-header">
        <div>
          <span className="panel-eyebrow">Registro diario</span>
          <h2 id="detalle-dia-title" className="detail-date">
            {formatearFechaLarga(fecha)}
          </h2>
        </div>
        <span className={`status-chip${claseEstado}`}>
          <span className="status-chip-dot" aria-hidden="true" />
          {etiquetaEstado}
        </span>
      </header>

      {estado === 'cargando' ? (
        <div className="detail-state" role="status" aria-live="polite">
          <span className="empty-icon" aria-hidden="true">
            <span className="loading-spinner" />
          </span>
          <h3>Cargando jornada…</h3>
          <p>Consultando la fecha seleccionada.</p>
        </div>
      ) : null}

      {estado === 'error' ? (
        <div className="detail-state" role="alert">
          <span className="empty-icon is-error" aria-hidden="true">
            <InfoIcon size={20} />
          </span>
          <h3>No se pudo cargar la jornada</h3>
          <p>{errorDetalle}</p>
          <button
            type="button"
            className="quiet-button detail-retry"
            onClick={onReintentar}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {estado === 'listo' ? (
        <>
          {jornada && !modoEdicion ? (
            <JornadaReadView
              jornada={jornada}
              errorGuardado={errorGuardado}
              mensajeExito={mensajeExito}
              onEditar={() => setModoEdicion(true)}
            />
          ) : (
            <>
              {!jornada ? (
                <div
                  className="detail-note detail-empty-note"
                  role="status"
                >
                  <CalendarOffIcon size={15} />
                  <div>
                    <span>Día no trabajado o sin registro</span>
                    <p>
                      Completa los datos para crear la jornada de esta
                      fecha.
                    </p>
                  </div>
                </div>
              ) : null}

              <JornadaForm
                key={`${fecha}:${jornada?.updatedAt ?? 'nueva'}`}
                fecha={fecha}
                jornada={jornada}
                guardando={guardando}
                guardadoEnOtraFecha={guardadoEnOtraFecha}
                errorGuardado={errorGuardado}
                mensajeExito={mensajeExito}
                onGuardar={(datos) => {
                  void manejarGuardar(datos);
                }}
                onCancelar={
                  jornada ? () => setModoEdicion(false) : undefined
                }
              />
            </>
          )}

          <div className="panel-footnote">
            <InfoIcon size={13} />
            {jornada
              ? modoEdicion
                ? 'La fecha no se puede modificar. Importes en COP.'
                : 'Jornada en solo lectura. Pulsa Editar para modificarla.'
              : 'Completa los datos para registrar la jornada.'}
          </div>
        </>
      ) : null}
    </section>
  );
}
