import {
  PERSONAS,
  type DatosCreacionJornada,
  type DatosJornada,
  type Jornada,
  type Persona,
} from '../types/jornada';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'http://127.0.0.1:3000/api'
).replace(/\/+$/, '');

type TipoErrorApi = 'conexion' | 'http' | 'respuesta';

export class ApiError extends Error {
  readonly tipo: TipoErrorApi;
  readonly status: number | null;

  constructor(
    mensaje: string,
    tipo: TipoErrorApi,
    status: number | null = null,
  ) {
    super(mensaje);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
  }
}

export function esErrorDeAborto(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function esEnteroNoNegativo(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;
}

function esPersona(valor: unknown): valor is Persona {
  return (
    typeof valor === 'string' &&
    PERSONAS.some((persona) => persona === valor)
  );
}

function esJornada(valor: unknown): valor is Jornada {
  if (!esObjeto(valor)) {
    return false;
  }

  const ingresos = valor.ingresos;
  const gastos = valor.gastos;

  return (
    typeof valor.fecha === 'string' &&
    esPersona(valor.persona) &&
    esObjeto(ingresos) &&
    esEnteroNoNegativo(ingresos.efectivo) &&
    esEnteroNoNegativo(ingresos.uber) &&
    Array.isArray(gastos) &&
    gastos.every(
      (gasto) =>
        esObjeto(gasto) &&
        typeof gasto.id === 'string' &&
        typeof gasto.concepto === 'string' &&
        esEnteroNoNegativo(gasto.valor),
    ) &&
    (valor.observaciones === undefined ||
      typeof valor.observaciones === 'string') &&
    typeof valor.createdAt === 'string' &&
    typeof valor.updatedAt === 'string'
  );
}

async function solicitar(
  ruta: string,
  opciones: RequestInit,
  signal?: AbortSignal,
): Promise<unknown> {
  const cabeceras: Record<string, string> = {
    Accept: 'application/json',
  };

  if (opciones.body !== undefined) {
    cabeceras['Content-Type'] = 'application/json';
  }

  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      ...opciones,
      headers: cabeceras,
      signal,
    });
  } catch (error) {
    if (esErrorDeAborto(error)) {
      throw error;
    }

    throw new ApiError(
      'No se pudo conectar con la API.',
      'conexion',
    );
  }

  if (!respuesta.ok) {
    throw new ApiError(
      `La API respondió con estado ${respuesta.status}.`,
      'http',
      respuesta.status,
    );
  }

  if (respuesta.status === 204) {
    return null;
  }

  try {
    return (await respuesta.json()) as unknown;
  } catch {
    throw new ApiError(
      'La API devolvió una respuesta inválida.',
      'respuesta',
    );
  }
}

function validarJornada(datos: unknown): Jornada {
  if (!esJornada(datos)) {
    throw new ApiError(
      'La API devolvió una jornada con un formato inválido.',
      'respuesta',
    );
  }

  return datos;
}

export async function listarJornadasMes(
  mes: string,
  signal?: AbortSignal,
): Promise<Jornada[]> {
  const datos = await solicitar(
    `/jornadas?mes=${encodeURIComponent(mes)}`,
    { method: 'GET' },
    signal,
  );

  if (!Array.isArray(datos) || !datos.every(esJornada)) {
    throw new ApiError(
      'La API devolvió una lista de jornadas inválida.',
      'respuesta',
    );
  }

  return datos;
}

export async function obtenerJornada(
  fecha: string,
  signal?: AbortSignal,
): Promise<Jornada | null> {
  try {
    const datos = await solicitar(
      `/jornadas/${encodeURIComponent(fecha)}`,
      { method: 'GET' },
      signal,
    );

    return validarJornada(datos);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function crearJornada(
  datos: DatosCreacionJornada,
  signal?: AbortSignal,
): Promise<Jornada> {
  const respuesta = await solicitar(
    '/jornadas',
    {
      method: 'POST',
      body: JSON.stringify({
        ...datos,
        gastos: datos.gastos.map(({ concepto, valor }) => ({
          concepto,
          valor,
        })),
      }),
    },
    signal,
  );

  return validarJornada(respuesta);
}

export async function actualizarJornada(
  fecha: string,
  datos: DatosJornada,
  signal?: AbortSignal,
): Promise<Jornada> {
  const respuesta = await solicitar(
    `/jornadas/${encodeURIComponent(fecha)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(datos),
    },
    signal,
  );

  return validarJornada(respuesta);
}
