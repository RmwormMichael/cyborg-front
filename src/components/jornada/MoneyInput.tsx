import { useRef } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { formatearEntero } from '../../utils/format';

interface MoneyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'inputMode' | 'value' | 'onChange'
  > {
  value: string;
  onValueChange: (digitos: string) => void;
  invalid?: boolean;
}

function contarDigitosHasta(texto: string, posicion: number): number {
  return texto.slice(0, posicion).replace(/\D/g, '').length;
}

function posicionTrasDigitos(texto: string, cantidad: number): number {
  if (cantidad <= 0) {
    return 0;
  }

  let contados = 0;

  for (let indice = 0; indice < texto.length; indice += 1) {
    if (/\d/.test(texto[indice])) {
      contados += 1;

      if (contados === cantidad) {
        return indice + 1;
      }
    }
  }

  return texto.length;
}

export function MoneyInput({
  value,
  onValueChange,
  invalid = false,
  className,
  ...props
}: MoneyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digitos = value.replace(/\D/g, '');
  const texto = digitos ? formatearEntero(Number(digitos)) : '';

  function manejarCambio(evento: ChangeEvent<HTMLInputElement>): void {
    const input = evento.currentTarget;
    const posicion = input.selectionStart ?? input.value.length;
    const digitosAntes = contarDigitosHasta(input.value, posicion);
    const nuevosDigitos = input.value
      .replace(/\D/g, '')
      .replace(/^0+(?=\d)/, '')
      .slice(0, 15);

    onValueChange(nuevosDigitos);

    const textoFormateado = nuevosDigitos
      ? formatearEntero(Number(nuevosDigitos))
      : '';

    requestAnimationFrame(() => {
      const elemento = inputRef.current;

      if (!elemento) {
        return;
      }

      const nuevaPosicion = posicionTrasDigitos(
        textoFormateado,
        digitosAntes,
      );
      elemento.setSelectionRange(nuevaPosicion, nuevaPosicion);
    });
  }

  return (
    <div className={`money-input${invalid ? ' is-invalid' : ''}`}>
      <span className="money-prefix" aria-hidden="true">
        $
      </span>
      <input
        {...props}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={`form-input money-field${className ? ` ${className}` : ''}`}
        value={texto}
        onChange={manejarCambio}
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}
