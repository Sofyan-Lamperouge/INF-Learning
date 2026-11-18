// src/components/student/profil/ProfilIcons.jsx
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const BackIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>);
export const CameraIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
    <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2a1.5 1.5 0 0 0 1.2-.6l.7-1A1.5 1.5 0 0 1 10.8 4h2.4a1.5 1.5 0 0 1 1.2.6l.7 1a1.5 1.5 0 0 0 1.2.6h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
    <circle cx="12" cy="12.5" r="3.4" />
  </svg>
);
export const ImageIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    <circle cx="9" cy="9" r="1.8" />
    <path d="M4 18l5.2-5.2a1.6 1.6 0 0 1 2.2 0L20 21" />
  </svg>
);
export const CloseIcon = (p) => (<svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const CheckIcon = (p) => (<svg viewBox="0 0 24 24" {...base} strokeWidth={3} {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>);
export const CrossIcon = (p) => (<svg viewBox="0 0 24 24" {...base} strokeWidth={3} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
