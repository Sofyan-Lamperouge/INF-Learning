// src/components/student/bantuan/BantuanIcons.jsx
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const InfoIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 11v5.5" /><circle cx="12" cy="7.6" r="0.6" fill="currentColor" /></svg>);
export const UsersIcon = (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20c0-3.6 2.9-5.8 6.5-5.8s6.5 2.2 6.5 5.8" /><path d="M15.6 4.6a3.6 3.6 0 0 1 0 6.8" /><path d="M18 14.6c2 .7 3.5 2.4 3.5 5.4" /></svg>);
export const LogoutDoorIcon = (p) => (<svg {...base} {...p}><path d="M10 3.5H6.5A2.5 2.5 0 0 0 4 6v12a2.5 2.5 0 0 0 2.5 2.5H10" /><path d="M9.5 12h11" /><path d="m16.5 7.5 4.5 4.5-4.5 4.5" /></svg>);
export const ChevronIcon = (p) => (<svg {...base} strokeWidth={2.6} {...p}><path d="m6 9 6 6 6-6" /></svg>);
export const CloseIcon = (p) => (<svg {...base} strokeWidth={2.2} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const WhatsAppIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M3.5 20.5l1.2-4.2A8.6 8.6 0 1 1 8 19.6z" />
    <path d="M9 8.6c.2-.5.5-.5.8-.5l.5 1.1c.1.3 0 .5-.2.7l-.4.5c.6 1.2 1.6 2.1 2.8 2.7l.5-.5c.2-.2.4-.2.7-.1l1.1.6c.2.2.2.4.1.8-.3.9-1.4 1.4-2.3 1.1-2.6-.8-4.4-2.6-5-4.4-.1-.7.3-1.7.9-2z" fill="currentColor" stroke="none" />
  </svg>
);
