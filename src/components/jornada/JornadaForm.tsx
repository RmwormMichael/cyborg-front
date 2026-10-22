import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  DatosJornada,
  GastoEntrada,
  Jornada,
  Persona,
} from '../../types/jornada';
import { ETIQUETAS_PERSONA, PERSONAS } from '../../types/jornada';
import { formatearFechaCorta } from '../../utils/dates';
import { formatearMoneda } from '../../utils/format';
import { calcularTotalesDesde } from '../../utils/jornadas';
import { CheckIcon, InfoIcon, PlusIcon, TrashIcon } from '../ui/Icons';
import { MoneyInput } from './MoneyInput';

interface JornadaFormProps {
  fecha: string;
  jornada: Jornada | null;
  guardando: boolean;
  guardadoEnOtraFecha: boolean;
  errorGuardado: string;
  mensajeExito: string;
  onGuardar: (datos: DatosJornada) => void;
  onCancelar?: () => void;
}

interface GastoFormulario {
  clave: string;
  id?: string;
  concepto: string;
  valor: string;
}

interface ErroresGasto {
  concepto?: string;
  valor?: string;
}

const OPCIONES_PERSONA: ReadonlyArray<{
  valor: Persona;
  etiqueta: string;
}> = PERSONAS.map((persona) => ({
  valor: persona,
  etiqueta: ETIQUETAS_PERSONA[persona],
}));

const CLAVE_GASTO_GASOLINA = 'gasto-gasolina';

function crearGastosIniciales(jornada: Jornada | null): GastoFormulario[] {
  if (!jornada) {
    return [
      {
        clave: CLAVE_GASTO_GASOLINA,
        concepto: 'Gasolina',
        valor: '',
      },
    ];
  }

  return jornada.gastos.map((gasto) => ({
    clave: gasto.id,
    id: gasto.id,
    concepto: gasto.concepto,
    valor: String(gasto.valor),
  }));
}

export function JornadaForm({
  fecha,
  jornada,
  guardando,
  guardadoEnOtraFecha,
  errorGuardado,
  mensajeExito,
  onGuardar,
  onCancelar,
}: JornadaFormProps) {
  const [persona, setPersona] = useState<Persona>(
    jornada?.persona ?? 'papa',
  );
  const [efectivo, setEfectivo] = useState(
    jornada ? String(jornada.ingresos.efectivo) : '',
  );
  const [uber, setUber] = useState(
    jornada ? String(jornada.ingresos.uber) : '',
  );
  const [gastos, setGastos] = useState<GastoFormulario[]>(() =>
    crearGastosIniciales(jornada),
  );
  const [observaciones, setObservaciones] = useState(
    jornada?.observaciones ?? '',
  );
  const [errores, setErrores] = useState<Record<string, ErroresGasto>>({});
  const formularioRef = useRef<HTMLFormElement>(null);
  const debeEnfocarError = useRef(false);
  const contadorGastos = useRef(0);

  const totales = useMemo(
    () =>
      calcularTotalesDesde(
        {
          efectivo: Number(efectivo || '0'),
          uber: Number(uber || '0'),
        },
        gastos.map((gasto) => ({
          valor: Number(gasto.valor || '0'),
        })),
      ),
    [efectivo, uber, gastos],
  );

  const hayErrores = Object.keys(errores).length > 0;

  useEffect(() => {
    if (!debeEnfocarError.current) {
      return;
    }

    debeEnfocarError.current = false;
    formularioRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [errores]);

  function crearClaveGasto(): string {
    contadorGastos.current += 1;
    return `gasto-nuevo-${contadorGastos.current}`;
  }

  function agregarGasto(): void {
    setGastos((actuales) => [
      ...actuales,
      {
        clave: crearClaveGasto(),
        concepto: '',
        valor: '',
      },
    ]);
  }

  function actualizarGasto(
    clave: string,
    campo: 'concepto' | 'valor',
    valor: string,
  ): void {
    setGastos((actuales) =>
      actuales.map((gasto) =>
        gasto.clave === clave ? { ...gasto, [campo]: valor } : gasto,
      ),
    );

    setErrores((actuales) => {
      const erroresFila = actuales[clave];

      if (!erroresFila?.[campo]) {
        return actuales;
      }

      const siguienteFila = { ...erroresFila };
      delete siguienteFila[campo];

      const siguientes = { ...actuales };

      if (Object.keys(siguienteFila).length > 0) {
        siguientes[clave] = siguienteFila;
      } else {
        delete siguientes[clave];
      }

      return siguientes;
    });
  }

  function eliminarGasto(clave: string): void {
    setGastos((actuales) =>
      actuales.filter((gasto) => gasto.clave !== clave),
    );

    setErrores((actuales) => {
      if (!actuales[clave]) {
        return actuales;
      }

      const siguientes = { ...actuales };
      delete siguientes[clave];
      return siguientes;
    });
  }

  function validar(): Record<string, ErroresGasto> {
    const nuevosErrores: Record<string, ErroresGasto> = {};

    for (const gasto of gastos) {
      const concepto = gasto.concepto.trim();
      const tieneConcepto = concepto.length > 0;
      const tieneValor = gasto.valor.length > 0;

      if (!tieneConcepto && !tieneValor) {
        continue;
      }

      const erroresFila: ErroresGasto = {};

      if (!tieneConcepto) {
        erroresFila.concepto = 'Escribe el concepto.';
      }

      if (!tieneValor) {
        erroresFila.valor = 'Escribe un valor.';
      }

      if (Object.keys(erroresFila).length > 0) {
        nuevosErrores[gasto.clave] = erroresFila;
      }
    }

    return nuevosErrores;
  }

  function manejarEnvio(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    if (guardando || guardadoEnOtraFecha) {
      return;
    }

    const erroresValidacion = validar();

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      debeEnfocarError.current = true;
      return;
    }

    setErrores({});

    const gastosEntrada: GastoEntrada[] = gastos
      .filter(
        (gasto) =>
          gasto.concepto.trim() !== '' || gasto.valor !== '',
      )
      .map((gasto) => ({
        ...(gasto.id ? { id: gasto.id } : {}),
        concepto: gasto.concepto.trim(),
        valor: Number(gasto.valor || '0'),
      }));

    onGuardar({
      persona,
      ingresos: {
        efectivo: Number(efectivo || '0'),
        uber: Number(uber || '0'),
      },
      gastos: gastosEntrada,
      observaciones: observaciones.trim(),
    });
  }

  return (
    <form
      ref={formularioRef}
      className="jornada-form"
      onSubmit={manejarEnvio}
      noValidate
      aria-busy={guardando}
      aria-label={
        jornada ? 'Editar jornada seleccionada' : 'Registrar jornada'
      }
    >
      {errorGuardado ? (
        <div className="form-alert is-error" role="alert">
          <InfoIcon size={14} />
          <div className="form-alert-content">{errorGuardado}</div>
          <button
            type="button"
            className="alert-action"
            disabled={guardando || guardadoEnOtraFecha}
            onClick={() => formularioRef.current?.requestSubmit()}
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {mensajeExito ? (
        <div className="form-alert is-success" role="status">
          <CheckIcon size={14} />
          <div className="form-alert-content">{mensajeExito}</div>
        </div>
      ) : null}

      {guardadoEnOtraFecha ? (
        <div className="form-alert" role="status">
          <InfoIcon size={14} />
          <div className="form-alert-content">
            Hay un guardado en curso. Podrás guardar esta fecha cuando
            termine.
          </div>
        </div>
      ) : null}

      {hayErrores ? (
        <div className="form-alert is-error" role="alert">
          <InfoIcon size={14} />
          <div className="form-alert-content">
            Revisa los campos marcados antes de guardar.
          </div>
        </div>
      ) : null}

      <fieldset className="form-fields" disabled={guardando}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="jornada-fecha">
              Fecha
            </label>
            <input
              id="jornada-fecha"
              className="form-input form-input-readonly"
              value={formatearFechaCorta(fecha)}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="jornada-persona">
              Persona
            </label>
            <select
              id="jornada-persona"
              className="form-input form-select"
              value={persona}
              onChange={(evento) =>
                setPersona(evento.currentTarget.value as Persona)
              }
            >
              {OPCIONES_PERSONA.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section
          className="detail-section"
          aria-labelledby="form-ingresos-title"
        >
          <div className="detail-section-head">
            <h3
              id="form-ingresos-title"
              className="detail-section-title"
            >
              Ingresos
            </h3>
            <span className="detail-section-amount">
              {formatearMoneda(totales.ingresosTotales)}
            </span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="jornada-efectivo">
                Efectivo
              </label>
              <MoneyInput
                id="jornada-efectivo"
                value={efectivo}
                onValueChange={setEfectivo}
                placeholder="0"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="jornada-uber">
                Uber
              </label>
              <MoneyInput
                id="jornada-uber"
                value={uber}
                onValueChange={setUber}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        <section
          className="detail-section"
          aria-labelledby="form-gastos-title"
        >
          <div className="detail-section-head">
            <h3 id="form-gastos-title" className="detail-section-title">
              Gastos
              <span className="section-count">{gastos.length}</span>
            </h3>
            <span className="detail-section-amount">
              {formatearMoneda(totales.gastosTotales)}
            </span>
          </div>

          {gastos.length > 0 ? (
            <div className="expense-editor">
              {gastos.map((gasto, indice) => {
                const erroresFila = errores[gasto.clave];
                const idConcepto = `gasto-concepto-${gasto.clave}`;
                const idValor = `gasto-valor-${gasto.clave}`;
                const idErrorConcepto = `${idConcepto}-error`;
                const idErrorValor = `${idValor}-error`;

                return (
                  <div className="expense-editor-row" key={gasto.clave}>
                    <div className="form-field">
                      <label className="sr-only" htmlFor={idConcepto}>
                        Concepto del gasto {indice + 1}
                      </label>
                      <input
                        id={idConcepto}
                        className="form-input"
                        value={gasto.concepto}
                        placeholder="Concepto"
                        maxLength={200}
                        aria-invalid={
                          erroresFila?.concepto ? true : undefined
                        }
                        aria-describedby={
                          erroresFila?.concepto
                            ? idErrorConcepto
                            : undefined
                        }
                        onChange={(evento) =>
                          actualizarGasto(
                            gasto.clave,
                            'concepto',
                            evento.currentTarget.value,
                          )
                        }
                      />
                      {erroresFila?.concepto ? (
                        <span
                          id={idErrorConcepto}
                          className="field-error"
                        >
                          {erroresFila.concepto}
                        </span>
                      ) : null}
                    </div>

                    <div className="form-field expense-value-field">
                      <label className="sr-only" htmlFor={idValor}>
                        Valor del gasto {indice + 1}
                      </label>
                      <MoneyInput
                        id={idValor}
                        value={gasto.valor}
                        onValueChange={(valor) =>
                          actualizarGasto(
                            gasto.clave,
                            'valor',
                            valor,
                          )
                        }
                        placeholder="0"
                        autoFocus={
                          !jornada &&
                          gasto.clave === CLAVE_GASTO_GASOLINA
                        }
                        invalid={Boolean(erroresFila?.valor)}
                        aria-describedby={
                          erroresFila?.valor ? idErrorValor : undefined
                        }
                      />
                      {erroresFila?.valor ? (
                        <span id={idErrorValor} className="field-error">
                          {erroresFila.valor}
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="icon-button expense-remove"
                      aria-label={`Eliminar gasto ${indice + 1}`}
                      title="Eliminar gasto"
                      onClick={() => eliminarGasto(gasto.clave)}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="detail-inline-empty">
              Sin gastos añadidos.
            </p>
          )}

          <button
            type="button"
            className="text-button"
            onClick={agregarGasto}
          >
            <PlusIcon size={13} />
            Añadir gasto
          </button>
        </section>

        <div
          className="detail-totals form-totals"
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

        <div className="form-field form-field-observaciones">
          <label className="form-label" htmlFor="jornada-observaciones">
            Observaciones
            <span className="form-optional">Opcional</span>
          </label>
          <textarea
            id="jornada-observaciones"
            className="form-input form-textarea"
            value={observaciones}
            maxLength={1000}
            rows={3}
            placeholder="Notas de la jornada"
            onChange={(evento) =>
              setObservaciones(evento.currentTarget.value)
            }
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={guardando || guardadoEnOtraFecha}
            title={
              guardadoEnOtraFecha
                ? 'Espera a que termine el guardado en curso.'
                : undefined
            }
          >
            {guardando ? (
              <>
                <span className="loading-spinner" aria-hidden="true" />
                Guardando…
              </>
            ) : jornada ? (
              'Guardar cambios'
            ) : (
              'Guardar jornada'
            )}
          </button>

          {jornada && onCancelar ? (
            <button
              type="button"
              className="secondary-button"
              disabled={guardando}
              onClick={onCancelar}
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}
