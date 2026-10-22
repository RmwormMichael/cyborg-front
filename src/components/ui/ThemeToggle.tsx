import type { Tema } from '../../hooks/useTheme';
import { MoonIcon, SunIcon } from './Icons';

interface ThemeToggleProps {
  tema: Tema;
  onChange: (tema: Tema) => void;
}

export function ThemeToggle({ tema, onChange }: ThemeToggleProps) {
  return (
    <div className="theme-control">
      <span className="theme-control-label">Tema</span>
      <div
        className="theme-switch"
        role="group"
        aria-label="Tema de la interfaz"
      >
        <button
          type="button"
          className="theme-option"
          aria-label="Usar tema oscuro"
          aria-pressed={tema === 'dark'}
          onClick={() => onChange('dark')}
        >
          <MoonIcon size={14} />
          <span>Oscuro</span>
        </button>
        <button
          type="button"
          className="theme-option"
          aria-label="Usar tema claro"
          aria-pressed={tema === 'light'}
          onClick={() => onChange('light')}
        >
          <SunIcon size={14} />
          <span>Claro</span>
        </button>
      </div>
    </div>
  );
}
