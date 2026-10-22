export const PERSONAS = ['papa', 'hermano'] as const;

export type Persona = (typeof PERSONAS)[number];

export interface Gasto {
  id: string;
  concepto: string;
  valor: number;
}

export interface Ingresos {
  efectivo: number;
  uber: number;
}

export interface Jornada {
  fecha: string;
  persona: Persona;
  ingresos: Ingresos;
  gastos: Gasto[];
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GastoEntrada {
  id?: string;
  concepto: string;
  valor: number;
}

export interface DatosJornada {
  persona: Persona;
  ingresos: Ingresos;
  gastos: GastoEntrada[];
  observaciones?: string;
}

export interface DatosCreacionJornada extends DatosJornada {
  fecha: string;
}

export type EstadoCarga = 'cargando' | 'listo' | 'error';

export interface TotalesJornada {
  ingresosTotales: number;
  gastosTotales: number;
  gananciaNeta: number;
}

export interface IndicadoresMes extends TotalesJornada {
  jornadas: number;
}

export const ETIQUETAS_PERSONA: Record<Persona, string> = {
  papa: 'Javier',
  hermano: 'Jeisson',
};
