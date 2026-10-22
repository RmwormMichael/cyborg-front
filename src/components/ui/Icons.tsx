import type { ReactNode, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

interface SvgIconProps extends IconProps {
  children: ReactNode;
}

function SvgIcon({
  size = 18,
  children,
  ...props
}: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SteeringWheelIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="currentColor"
        stroke="none"
      />
      <path d="M3.9 12h5.6M14.5 12h5.6M12 14.5v5.6" />
    </SvgIcon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3.5" y="5.2" width="17" height="15.3" rx="2.2" />
      <path d="M7.5 3.5v3.4M16.5 3.5v3.4M3.5 9.2h17" />
      <path d="M7.3 12.7h.1M12 12.7h.1M16.7 12.7h.1M7.3 16.8h.1M12 16.8h.1" />
    </SvgIcon>
  );
}

export function CalendarCheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3.5" y="5.2" width="17" height="15.3" rx="2.2" />
      <path d="M7.5 3.5v3.4M16.5 3.5v3.4M3.5 9.2h17" />
      <path d="m8.5 14.6 2.4 2.3 4.6-4.8" />
    </SvgIcon>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 19.5v-6M9.5 19.5V9M14.5 19.5v-4M19.5 19.5V5.5M3 19.5h18" />
    </SvgIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m14.5 6-6 6 6 6" />
    </SvgIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </SvgIcon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </SvgIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20 15.1A8.4 8.4 0 0 1 8.9 4a8.4 8.4 0 1 0 11.1 11.1Z" />
    </SvgIcon>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 7.2A2.2 2.2 0 0 1 6.2 5h11.6A2.2 2.2 0 0 1 20 7.2v10.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 17.8Z" />
      <path d="M4 9h16M15.5 13h2.3" />
    </SvgIcon>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 3.8v17l2.2-1.4 2.3 1.4 2.3-1.4 2.3 1.4 2.3-1.4 2.2 1.4v-17L17.4 5l-2.3-1.4L12.8 5l-2.3-1.4L8.2 5Z" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </SvgIcon>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4 15.5 5.2-5.2 3.4 3.4L20 6.5" />
      <path d="M14.5 6.5H20v5.5" />
    </SvgIcon>
  );
}

export function CashIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="6.2" width="18" height="11.6" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.2 9.2h.1M17.7 14.8h.1" />
    </SvgIcon>
  );
}

export function RouteIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8.2 6h4.3a3.5 3.5 0 0 1 0 7H11a3.5 3.5 0 0 0 0 7h4.8" />
    </SvgIcon>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 3.8h9.2L19 7.6v12.6H6Z" />
      <path d="M14.8 3.8v4h4M9 11.5h6M9 15h6" />
    </SvgIcon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.8v5M12 7.7h.1" />
    </SvgIcon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 5v14M5 12h14" />
    </SvgIcon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 7h15M9.5 4.5h5M7 7l.8 12.5h8.4L17 7" />
      <path d="M10.2 10.5v5.5M13.8 10.5v5.5" />
    </SvgIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m5 12.5 4.4 4.3L19 7.5" />
    </SvgIcon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4.5 19.5 3.7-.8L19 7.9 16.1 5 5.3 15.8Z" />
      <path d="m13.8 7.3 2.9 2.9" />
    </SvgIcon>
  );
}

export function CalendarOffIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4.3 4.3 15.4 15.4" />
      <path d="M6.7 4.5h11.8A2 2 0 0 1 20.5 6.7v10.1M18.2 20.5H5.5a2 2 0 0 1-2-2V6.7a2 2 0 0 1 1-1.8" />
      <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.2h13" />
    </SvgIcon>
  );
}
