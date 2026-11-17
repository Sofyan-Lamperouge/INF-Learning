// src/components/student/baca/BacaIcons.jsx
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const BackIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>);
export const DownloadIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 4v11" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></svg>);
export const CalendarIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>);
export const ScrollDownIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 5v13" /><path d="M6 13l6 6 6-6" /></svg>);
export const MinusIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 12h12" /></svg>);
export const PlusIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 6v12M6 12h12" /></svg>);
export const ExpandIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
export const CollapseIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>);
export const CheckIcon = (p) => (<svg viewBox="0 0 24 24" {...base} strokeWidth={3} {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>);
export const CrossIcon = (p) => (<svg viewBox="0 0 24 24" {...base} strokeWidth={3} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const CloseIcon = (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
