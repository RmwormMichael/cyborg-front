import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { EstadoCarga } from '../../types/jornada';
import {
  DIAS_SEMANA,
  diasEnMes,
  fechaDelMes,
  fechaAIso,
  formatearFechaLarga,
  formatearMes,
  indiceDiaSemanaLunes,
  primerDiaDelMes,
} from '../../utils/dates';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';

interface MonthCalendarProps {
  mes: Date;
  fechaSeleccionada: string;
  hoy: Date;
  fechasConJornada: ReadonlySet<string>;
  estado: EstadoCarga;
  onSeleccionarFecha: (fecha: string) => void;
  onMesAnterior: () => void;
  onMesSiguiente: () => void;
  onIrAHoy: () => void;
}

export function MonthCalendar({
  mes,
  fechaSeleccionada,
  hoy,
  fechasConJornada,
  estado,
  onSeleccionarFecha,
  onMesAnterior,
  onMesSiguiente,
  onIrAHoy,
}: MonthCalendarProps) {
  const anio = mes.getFullYear();
  const indiceMes = mes.getMonth();
  const totalDias = diasEnMes(anio, indiceMes);
  const desplazamiento = indiceDiaSemanaLunes(
    primerDiaDelMes(anio, indiceMes),
  );
  const totalCeldas = Math.max(
    35,
    Math.ceil((desplazamiento + totalDias) / 7) * 7,
  );
  const celdasFinales = totalCeldas - desplazamiento - totalDias;
  const hoyIso = fechaAIso(hoy);
  const [fechaEnfocada, setFechaEnfocada] = useState(fechaSeleccionada);
  const refsDias = useRef(new Map<string, HTMLButtonElement>());
  const focoPendiente = useRef(false);

  useEffect(() => {
    setFechaEnfocada(fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (!focoPendiente.current) {
      return;
    }

    const elemento = refsDias.current.get(fechaEnfocada);

    if (elemento) {
      focoPendiente.current = false;
      elemento.focus();
    }
  }, [fechaEnfocada]);

  function moverFoco(dia: number): void {
    if (dia < 1 || dia > totalDias) {
      return;
    }

    focoPendiente.current = true;
    setFechaEnfocada(fechaDelMes(anio, indiceMes, dia));
  }

  function manejarTecla(
    evento: KeyboardEvent<HTMLButtonElement>,
    fecha: string,
  ): void {
    const dia = Number(fecha.slice(-2));
    let nuevoDia: number | null = null;

    switch (evento.key) {
      case 'ArrowLeft':
        nuevoDia = dia - 1;
        break;
      case 'ArrowRight':
        nuevoDia = dia + 1;
        break;
      case 'ArrowUp':
        nuevoDia = dia - 7;
        break;
      case 'ArrowDown':
        nuevoDia = dia + 7;
        break;
      case 'Home':
        nuevoDia = 1;
        break;
      case 'End':
        nuevoDia = totalDias;
        break;
      default:
        return;
    }

    evento.preventDefault();
    moverFoco(nuevoDia);
  }

  const dias = Array.from({ length: totalDias }, (_, indice) => {
    const dia = indice + 1;
    const fecha = fechaDelMes(anio, indiceMes, dia);
    const columna = (desplazamiento + indice) % 7;
    const esFinDeSemana = columna >= 5;
    const tieneJornada = fechasConJornada.has(fecha);
    const esSeleccionado = fecha === fechaSeleccionada;
    const esDiaDeHoy = fecha === hoyIso;
    const clases = ['calendar-day'];

    if (tieneJornada) {
      clases.push('has-jornada');
    }

    if (esSeleccionado) {
      clases.push('is-selected');
    }

    if (esDiaDeHoy) {
      clases.push('is-today');
    }

    if (esFinDeSemana) {
      clases.push('is-weekend');
    }

    const etiqueta = [formatearFechaLarga(fecha)];

    if (esDiaDeHoy) {
      etiqueta.push('hoy');
    }

    if (estado === 'listo') {
      etiqueta.push(
        tieneJornada
          ? 'con jornada registrada'
          : 'sin jornada registrada',
      );
    } else {
      etiqueta.push('estado de jornada no disponible');
    }

    return {
      dia,
      fecha,
      clases: clases.join(' '),
      etiqueta: etiqueta.join(', '),
      esSeleccionado,
      tieneJornada,
    };
  });

  const cantidadJornadas = fechasConJornada.size;
  const subtitulo =
    estado === 'cargando'
      ? 'Cargando jornadas…'
      : estado === 'error'
        ? 'No se pudieron cargar las jornadas'
        : `${cantidadJornadas} ${
            cantidadJornadas === 1
              ? 'jornada registrada'
              : 'jornadas registradas'
          }`;

  return (
    <section
      className="panel calendar-panel"
      aria-labelledby="calendar-heading"
      aria-busy={estado === 'cargando'}
    >
      <div className="calendar-header">
        <div>
          <h2 id="calendar-heading" className="calendar-title" aria-live="polite">
            {formatearMes(mes)}
          </h2>
          <p className="calendar-subtitle">{subtitulo}</p>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            className="icon-button"
            aria-label="Mes anterior"
            title="Mes anterior"
            onClick={onMesAnterior}
          >
            <ChevronLeftIcon size={15} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Mes siguiente"
            title="Mes siguiente"
            onClick={onMesSiguiente}
          >
            <ChevronRightIcon size={15} />
          </button>
          <button
            type="button"
            className="quiet-button"
            onClick={onIrAHoy}
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia} className="calendar-weekday">
            {dia}
          </span>
        ))}
      </div>

      <div
        className="calendar-grid"
        role="group"
        aria-label={`Días de ${formatearMes(mes)}`}
      >
        {Array.from({ length: desplazamiento }, (_, indice) => (
          <span
            key={`inicio-${indice}`}
            className="calendar-day is-empty"
            aria-hidden="true"
          />
        ))}

        {dias.map((dia) => (
          <button
            key={dia.fecha}
            ref={(elemento) => {
              if (elemento) {
                refsDias.current.set(dia.fecha, elemento);
              } else {
                refsDias.current.delete(dia.fecha);
              }
            }}
            type="button"
            className={dia.clases}
            aria-label={dia.etiqueta}
            aria-pressed={dia.esSeleccionado}
            aria-current={dia.fecha === hoyIso ? 'date' : undefined}
            tabIndex={dia.fecha === fechaEnfocada ? 0 : -1}
            onClick={() => onSeleccionarFecha(dia.fecha)}
            onFocus={() => setFechaEnfocada(dia.fecha)}
            onKeyDown={(evento) => manejarTecla(evento, dia.fecha)}
          >
            <span className="calendar-day-number">{dia.dia}</span>
            {dia.tieneJornada ? (
              <span className="calendar-day-marker" aria-hidden="true" />
            ) : null}
          </button>
        ))}

        {Array.from({ length: celdasFinales }, (_, indice) => (
          <span
            key={`fin-${indice}`}
            className="calendar-day is-empty"
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot" aria-hidden="true" />
          Jornada registrada
        </span>
        <span className="legend-item">
          <span className="legend-selection" aria-hidden="true" />
          Día seleccionado
        </span>
      </div>
    </section>
  );
}
