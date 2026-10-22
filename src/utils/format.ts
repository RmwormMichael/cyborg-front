const FORMATO_ENTERO = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0,
});

export function formatearMoneda(valor: number): string {
  const signo = valor < 0 ? '-' : '';
  return `${signo}$${FORMATO_ENTERO.format(Math.abs(valor))}`;
}

export function formatearEntero(valor: number): string {
  return FORMATO_ENTERO.format(valor);
}
