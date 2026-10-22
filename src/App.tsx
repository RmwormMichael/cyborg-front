import { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { useTheme } from './hooks/useTheme';
import { CalendarPage } from './pages/CalendarPage';
import { ReportsPage } from './pages/ReportsPage';
import type { Vista } from './types/navigation';

function App() {
  const { tema, cambiarTema } = useTheme();
  const [vista, setVista] = useState<Vista>('calendario');

  useEffect(() => {
    document.title =
      vista === 'calendario'
        ? 'Calendario · Control del Carro'
        : 'Reportes · Control del Carro';
  }, [vista]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>

      <Sidebar
        vista={vista}
        tema={tema}
        onNavegar={setVista}
        onCambiarTema={cambiarTema}
      />

      <div className="app-main">
        <Topbar vista={vista} />

        <main
          id="contenido-principal"
          className="page-content"
          tabIndex={-1}
        >
          {vista === 'calendario' ? <CalendarPage /> : <ReportsPage />}
        </main>

        <footer className="app-footer">
          <span>Control del Carro</span>
          <span>Interfaz local · Etapa 4</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
