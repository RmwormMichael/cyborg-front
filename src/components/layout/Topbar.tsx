import type { Vista } from '../../types/navigation';

const ETIQUETAS_VISTA: Record<Vista, string> = {
  calendario: 'Calendario',
  reportes: 'Reportes',
};

interface TopbarProps {
  vista: Vista;
}

export function Topbar({ vista }: TopbarProps) {
  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Ubicación">
        <span>Panel</span>
        <span className="breadcrumb-separator" aria-hidden="true">
          /
        </span>
        <span className="breadcrumb-current" aria-current="page">
          {ETIQUETAS_VISTA[vista]}
        </span>
      </nav>

      <span className="env-badge">
        <span className="env-badge-dot" aria-hidden="true" />
        API local · COP
      </span>
    </header>
  );
}
