import type {
  IndicadoresMes,
  Ingresos,
  Jornada,
  TotalesJornada,
} from '../types/jornada';

export function calcularTotalesDesde(
  ingresos: Ingresos,
  gastos: readonly { valor: number }[],
): TotalesJornada {
  const ingresosTotales = ingresos.efectivo + ingresos.uber;
  const gastosTotales = gastos.reduce(
    (total, gasto) => total + gasto.valor,
    0,
  );

  return {
    ingresosTotales,
    gastosTotales,
    gananciaNeta: ingresosTotales - gastosTotales,
  };
}

export function calcularTotales(jornada: Jornada): TotalesJornada {
  return calcularTotalesDesde(jornada.ingresos, jornada.gastos);
}

export function calcularIndicadores(
  jornadas: readonly Jornada[],
): IndicadoresMes {
  return jornadas.reduce<IndicadoresMes>(
    (acumulado, jornada) => {
      const totales = calcularTotales(jornada);

      return {
        ingresosTotales: acumulado.ingresosTotales + totales.ingresosTotales,
        gastosTotales: acumulado.gastosTotales + totales.gastosTotales,
        gananciaNeta: acumulado.gananciaNeta + totales.gananciaNeta,
        jornadas: acumulado.jornadas + 1,
      };
    },
    {
      ingresosTotales: 0,
      gastosTotales: 0,
      gananciaNeta: 0,
      jornadas: 0,
    },
  );
}

export function reemplazarJornada(
  jornadas: readonly Jornada[],
  jornada: Jornada,
): Jornada[] {
  return [
    ...jornadas.filter((actual) => actual.fecha !== jornada.fecha),
    jornada,
  ].sort((a, b) => a.fecha.localeCompare(b.fecha));
}
