// src/components/student/StudentIcons.jsx
// Ikon top bar & dashboard mahasiswa. Warna mengikuti `color` (currentColor).

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const PlayIcon = (p) => (
  <svg {...base} {...p}><path d="M7 4.5v15L19 12z" /></svg>
);

export const BoltIcon = (p) => (
  <svg {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
);

export const BookIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </svg>
);

export const CheckBoxIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
);

export const ChevronDownIcon = (p) => (
  <svg {...base} strokeWidth={2.5} {...p}><path d="m6 9 6 6 6-6" /></svg>
);

export const ChevronRightIcon = (p) => (
  <svg {...base} strokeWidth={2.5} {...p}><path d="m9 18 6-6-6-6" /></svg>
);

export const ArrowRightIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const LogoutIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

/* Ikon dokumen merah muda untuk thumbnail materi */
export function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 56 69" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 2h24l20 20v37a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V10a8 8 0 0 1 8-8Z"
        fill="#F7B9B9"
        stroke="#E53935"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M34 2v14a6 6 0 0 0 6 6h14"
        stroke="#E53935"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}