import { useEffect, useState } from 'react';

export type Tema = 'dark' | 'light';

const CLAVE_TEMA = 'control-del-carro-theme';
const COLORES_TEMA: Record<Tema, string> = {
  dark: '#171717',
  light: '#f7f7f7',
};

function leerTemaInicial(): Tema {
  return document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark';
}

export function useTheme() {
  const [tema, setTema] = useState<Tema>(leerTemaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;

    try {
      window.localStorage.setItem(CLAVE_TEMA, tema);
    } catch {
      void 0;
    }

    const metaTema = document.querySelector('meta[name="theme-color"]');
    metaTema?.setAttribute('content', COLORES_TEMA[tema]);
  }, [tema]);

  return {
    tema,
    cambiarTema: setTema,
  };
}
