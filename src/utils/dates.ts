const FORMATO_MES = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
});

const FORMATO_FECHA_LARGA = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const FORMATO_FECHA_CORTA = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const DIAS_SEMANA = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function dosDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

export function crearFecha(anio: number, mes: number, dia: number): Date {
  return new Date(anio, mes, dia, 12);
}

export function fechaAIso(fecha: Date): string {
  return [
    fecha.getFullYear(),
    dosDigitos(fecha.getMonth() + 1),
    dosDigitos(fecha.getDate()),
  ].join('-');
}

export function mesAIso(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}`;
}

export function mesDeFechaIso(fecha: string): string {
  return fecha.slice(0, 7);
}

export function isoAFecha(fecha: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return crearFecha(anio, mes - 1, dia);
}

export function fechaDelMes(
  anio: number,
  mes: number,
  dia: number,
): string {
  return `${anio}-${dosDigitos(mes + 1)}-${dosDigitos(dia)}`;
}

export function primerDiaDelMes(anio: number, mes: number): Date {
  return crearFecha(anio, mes, 1);
}

export function sumarMeses(fecha: Date, cantidad: number): Date {
  return crearFecha(fecha.getFullYear(), fecha.getMonth() + cantidad, 1);
}

export function diasEnMes(anio: number, mes: number): number {
  return crearFecha(anio, mes + 1, 0).getDate();
}

export function indiceDiaSemanaLunes(fecha: Date): number {
  return (fecha.getDay() + 6) % 7;
}

export function fechaEnMes(fecha: string, anio: number, mes: number): boolean {
  return fecha.startsWith(`${anio}-${dosDigitos(mes + 1)}-`);
}

export function esHoy(fecha: string, hoy: Date = new Date()): boolean {
  return fecha === fechaAIso(hoy);
}

export function formatearMes(fecha: Date): string {
  return capitalizar(FORMATO_MES.format(fecha));
}

export function formatearFechaLarga(fecha: string): string {
  return capitalizar(FORMATO_FECHA_LARGA.format(isoAFecha(fecha)));
}

export function formatearFechaCorta(fecha: string): string {
  return FORMATO_FECHA_CORTA.format(isoAFecha(fecha));
}
