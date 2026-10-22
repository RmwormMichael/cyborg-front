import type { Tema } from '../../hooks/useTheme';
import type { Vista } from '../../types/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CalendarIcon, ChartIcon } from '../ui/Icons';

interface SidebarProps {
  vista: Vista;
  tema: Tema;
  onNavegar: (vista: Vista) => void;
  onCambiarTema: (tema: Tema) => void;
}

export function Sidebar({
  vista,
  tema,
  onNavegar,
  onCambiarTema,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span
          className="brand-mark brand-mark-suzuki"
          aria-hidden="true"
        >
          <img
            className="brand-logo"
            src="/suzuki-logo.svg"
            alt=""
          />
        </span>
        <span className="brand-copy">
          <strong>Control del Carro</strong>
          <small>Panel de jornadas</small>
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        <span className="nav-label">Panel</span>
        <ul className="nav-list">
          <li>
            <button
              type="button"
              className="nav-item"
              aria-current={vista === 'calendario' ? 'page' : undefined}
              onClick={() => onNavegar('calendario')}
            >
              <CalendarIcon size={16} />
              <span>Calendario</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-item"
              aria-current={vista === 'reportes' ? 'page' : undefined}
              onClick={() => onNavegar('reportes')}
            >
              <ChartIcon size={16} />
              <span>Reportes</span>
              <span className="nav-item-tag">Pronto</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle tema={tema} onChange={onCambiarTema} />
        <span className="sidebar-version">Etapa 4 · API local</span>
      </div>
    </aside>
  );
}
