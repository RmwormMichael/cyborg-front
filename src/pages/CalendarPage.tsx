import { useEffect, useMemo, useRef, useState } from 'react';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { DailyDetailPanel } from '../components/jornada/DailyDetailPanel';
import { MonthMetrics } from '../components/jornada/MonthMetrics';
import { CalendarOffIcon, InfoIcon } from '../components/ui/Icons';
import {
  ApiError,
  actualizarJornada,
  crearJornada,
  esErrorDeAborto,
  listarJornadasMes,
  obtenerJornada,
} from '../services/jornadasApi';
import type {
  DatosJornada,
  EstadoCarga,
  Jornada,
} from '../types/jornada';
import {
  diasEnMes,
  fechaAIso,
  fechaDelMes,
  formatearMes,
  mesAIso,
  mesDeFechaIso,
  sumarMeses,
} from '../utils/dates';
import {
  calcularIndicadores,
  reemplazarJornada,
} from '../utils/jornadas';

function describirErrorMes(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.tipo === 'conexion') {
      return 'No se pudo conectar con la API. Revisa que el backend esté disponible e inténtalo de nuevo.';
    }

    if (error.tipo === 'respuesta') {
      return 'La API devolvió datos inválidos para el mes seleccionado.';
    }
  }

  return 'La API no pudo entregar las jornadas del mes. Inténtalo de nuevo.';
}

function describirErrorDetalle(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.tipo === 'conexion') {
      return 'No se pudo conectar con la API. Revisa que el backend esté disponible.';
    }

    if (error.tipo === 'respuesta') {
      return 'La API devolvió una jornada con un formato inválido.';
    }
  }

  return 'La API no pudo entregar la jornada seleccionada. Inténtalo de nuevo.';
}

function describirErrorGuardado(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'No se pudo guardar la jornada. Inténtalo de nuevo.';
  }

  if (error.status === 409) {
    return 'Ya existe una jornada registrada para esta fecha. Se recargaron los datos existentes.';
  }

  if (error.status === 400) {
    return 'La API rechazó los datos. Revisa los importes y los gastos antes de reintentar.';
  }

  if (error.status === 404) {
    return 'La jornada ya no existe en la API. Se recargarán los datos de la fecha.';
  }

  if (error.tipo === 'conexion') {
    return 'No se pudo conectar con la API. El formulario no se guardó.';
  }

  if (error.tipo === 'respuesta') {
    return 'La API devolvió una respuesta inválida al guardar. Recarga los datos e inténtalo de nuevo.';
  }

  return 'La API no pudo guardar la jornada. Inténtalo de nuevo.';
}

export function CalendarPage() {
  const [hoy] = useState(() => new Date());
  const [mesVisible, setMesVisible] = useState(
    () => new Date(hoy.getFullYear(), hoy.getMonth(), 1),
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() =>
    fechaAIso(hoy),
  );
  const [jornadasMes, setJornadasMes] = useState<Jornada[]>([]);
  const [estadoMes, setEstadoMes] = useState<EstadoCarga>('cargando');
  const [errorMes, setErrorMes] = useState('');
  const [versionMes, setVersionMes] = useState(0);
  const [jornadaSeleccionada, setJornadaSeleccionada] =
    useState<Jornada | null>(null);
  const [estadoDetalle, setEstadoDetalle] =
    useState<EstadoCarga>('cargando');
  const [errorDetalle, setErrorDetalle] = useState('');
  const [versionDetalle, setVersionDetalle] = useState(0);
  const [fechaGuardando, setFechaGuardando] = useState<string | null>(
    null,
  );
  const [errorGuardado, setErrorGuardado] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const anio = mesVisible.getFullYear();
  const mes = mesVisible.getMonth();
  const mesConsulta = mesAIso(mesVisible);
  const diasDelMes = diasEnMes(anio, mes);

  const fechaSeleccionadaRef = useRef(fechaSeleccionada);
  const mesConsultaRef = useRef(mesConsulta);
  const estadoMesRef = useRef(estadoMes);
  const guardandoRef = useRef(false);
  const montadoRef = useRef(true);

  useEffect(() => {
    fechaSeleccionadaRef.current = fechaSeleccionada;
  }, [fechaSeleccionada]);

  useEffect(() => {
    mesConsultaRef.current = mesConsulta;
  }, [mesConsulta]);

  useEffect(() => {
    estadoMesRef.current = estadoMes;
  }, [estadoMes]);

  useEffect(() => {
    montadoRef.current = true;

    return () => {
      montadoRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;

    setEstadoMes('cargando');
    setErrorMes('');
    setJornadasMes([]);

    listarJornadasMes(mesConsulta, controlador.signal)
      .then((jornadas) => {
        if (!activo) {
          return;
        }

        setJornadasMes(jornadas);
        setEstadoMes('listo');
      })
      .catch((error: unknown) => {
        if (!activo || esErrorDeAborto(error)) {
          return;
        }

        setJornadasMes([]);
        setEstadoMes('error');
        setErrorMes(describirErrorMes(error));
      });

    return () => {
      activo = false;
      controlador.abort();
    };
  }, [mesConsulta, versionMes]);

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;

    setEstadoDetalle('cargando');
    setErrorDetalle('');
    setJornadaSeleccionada(null);

    obtenerJornada(fechaSeleccionada, controlador.signal)
      .then((jornada) => {
        if (!activo) {
          return;
        }

        setJornadaSeleccionada(jornada);
        setEstadoDetalle('listo');
      })
      .catch((error: unknown) => {
        if (!activo || esErrorDeAborto(error)) {
          return;
        }

        setEstadoDetalle('error');
        setErrorDetalle(describirErrorDetalle(error));
      });

    return () => {
      activo = false;
      controlador.abort();
    };
  }, [fechaSeleccionada, versionDetalle]);

  useEffect(() => {
    if (!mensajeExito) {
      return;
    }

    const temporizador = window.setTimeout(() => {
      setMensajeExito('');
    }, 5000);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [mensajeExito]);

  const indicadores = useMemo(
    () => calcularIndicadores(jornadasMes),
    [jornadasMes],
  );

  const fechasConJornada = useMemo(
    () =>
      new Set(
        estadoMes === 'listo'
          ? jornadasMes.map((jornada) => jornada.fecha)
          : [],
      ),
    [estadoMes, jornadasMes],
  );

  const jornadaActual =
    estadoDetalle === 'listo' &&
    jornadaSeleccionada?.fecha === fechaSeleccionada
      ? jornadaSeleccionada
      : null;

  const guardandoActual = fechaGuardando === fechaSeleccionada;
  const guardadoEnOtraFecha =
    fechaGuardando !== null && fechaGuardando !== fechaSeleccionada;

  function prepararDetalle(): void {
    setEstadoDetalle('cargando');
    setJornadaSeleccionada(null);
    setErrorDetalle('');
    setErrorGuardado('');
    setMensajeExito('');
  }

  function seleccionarFecha(fecha: string): void {
    if (fecha === fechaSeleccionadaRef.current) {
      return;
    }

    fechaSeleccionadaRef.current = fecha;
    setFechaSeleccionada(fecha);
    prepararDetalle();
  }

  function cambiarMes(desplazamiento: number): void {
    const nuevoMes = sumarMeses(mesVisible, desplazamiento);
    const anioNuevo = nuevoMes.getFullYear();
    const mesNuevo = nuevoMes.getMonth();
    const diaSeleccionado = Number(fechaSeleccionada.slice(-2));
    const fechaNueva = fechaDelMes(
      anioNuevo,
      mesNuevo,
      Math.min(diaSeleccionado, diasEnMes(anioNuevo, mesNuevo)),
    );

    setMesVisible(nuevoMes);
    mesConsultaRef.current = mesAIso(nuevoMes);
    fechaSeleccionadaRef.current = fechaNueva;
    setFechaSeleccionada(fechaNueva);
    prepararDetalle();
  }

  function irAHoy(): void {
    const fechaHoy = fechaAIso(hoy);
    const mesHoy = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    setMesVisible(mesHoy);
    mesConsultaRef.current = mesAIso(mesHoy);

    if (fechaHoy !== fechaSeleccionadaRef.current) {
      fechaSeleccionadaRef.current = fechaHoy;
      setFechaSeleccionada(fechaHoy);
      prepararDetalle();
    }
  }

  async function guardarJornada(
    datos: DatosJornada,
  ): Promise<boolean> {
    if (guardandoRef.current) {
      return false;
    }

    const fechaGuardada = fechaSeleccionadaRef.current;
    const estabaEditando =
      jornadaSeleccionada?.fecha === fechaGuardada;

    guardandoRef.current = true;
    setFechaGuardando(fechaGuardada);
    setErrorGuardado('');
    setMensajeExito('');

    try {
      const guardada = estabaEditando
        ? await actualizarJornada(fechaGuardada, datos)
        : await crearJornada({ fecha: fechaGuardada, ...datos });

      if (!montadoRef.current) {
        return false;
      }

      if (fechaSeleccionadaRef.current === fechaGuardada) {
        setJornadaSeleccionada(guardada);
        setEstadoDetalle('listo');
        setErrorDetalle('');
        setMensajeExito('Jornada guardada correctamente.');
      }

      if (mesConsultaRef.current === mesDeFechaIso(guardada.fecha)) {
        if (estadoMesRef.current === 'listo') {
          setJornadasMes((actuales) =>
            reemplazarJornada(actuales, guardada),
          );
        } else {
          setVersionMes((version) => version + 1);
        }
      }

      return true;
    } catch (error: unknown) {
      if (!montadoRef.current) {
        return false;
      }

      const fechaActual = fechaSeleccionadaRef.current;
      const debeRecargar =
        error instanceof ApiError &&
        (error.status === 409 ||
          (error.status === 404 && estabaEditando));

      if (fechaActual === fechaGuardada) {
        setErrorGuardado(describirErrorGuardado(error));
      }

      if (debeRecargar) {
        if (fechaActual === fechaGuardada) {
          setVersionDetalle((version) => version + 1);
        }

        if (
          mesConsultaRef.current === mesDeFechaIso(fechaGuardada)
        ) {
          setVersionMes((version) => version + 1);
        }
      }

      return false;
    } finally {
      guardandoRef.current = false;

      if (montadoRef.current) {
        setFechaGuardando(null);
      }
    }
  }

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">Panel mensual</span>
          <h1>Calendario</h1>
          <p>
            Consulta, registra y edita las jornadas del vehículo. Navega por
            el calendario para revisar o completar cada día.
          </p>
        </div>
      </header>

      {estadoMes === 'cargando' ? (
        <div className="page-status" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <div>
            <strong>Cargando jornadas de {formatearMes(mesVisible)}…</strong>
            <span>Consultando la API local.</span>
          </div>
        </div>
      ) : null}

      {estadoMes === 'error' ? (
        <div className="page-status is-error" role="alert">
          <InfoIcon size={15} />
          <div>
            <strong>No se pudieron cargar las jornadas</strong>
            <span>{errorMes}</span>
          </div>
          <button
            type="button"
            className="quiet-button status-action"
            onClick={() => setVersionMes((version) => version + 1)}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {estadoMes === 'listo' && jornadasMes.length === 0 ? (
        <div className="page-status" role="status">
          <CalendarOffIcon size={15} />
          <div>
            <strong>Este mes no tiene jornadas registradas.</strong>
            <span>
              Selecciona un día y completa el formulario para crear la
              primera.
            </span>
          </div>
        </div>
      ) : null}

      <MonthMetrics
        indicadores={indicadores}
        diasDelMes={diasDelMes}
        estado={estadoMes}
      />

      <div className="dashboard-grid">
        <MonthCalendar
          mes={mesVisible}
          fechaSeleccionada={fechaSeleccionada}
          hoy={hoy}
          fechasConJornada={fechasConJornada}
          estado={estadoMes}
          onSeleccionarFecha={seleccionarFecha}
          onMesAnterior={() => cambiarMes(-1)}
          onMesSiguiente={() => cambiarMes(1)}
          onIrAHoy={irAHoy}
        />
        <DailyDetailPanel
          fecha={fechaSeleccionada}
          estado={estadoDetalle}
          jornada={jornadaActual}
          errorDetalle={errorDetalle}
          guardando={guardandoActual}
          guardadoEnOtraFecha={guardadoEnOtraFecha}
          errorGuardado={errorGuardado}
          mensajeExito={mensajeExito}
          onGuardar={guardarJornada}
          onReintentar={() =>
            setVersionDetalle((version) => version + 1)
          }
        />
      </div>
    </>
  );
}
