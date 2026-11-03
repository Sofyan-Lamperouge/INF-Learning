import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const GAP = 13; // jarak dari ikon ke kotak tooltip (sesuai Figma)
const EDGE = 12; // jarak minimum ke tepi layar

/**
 * Tooltip gelap dengan panah di kiri-atas, muncul di bawah ikon (sesuai Figma).
 * anchor = DOMRect tombol. Kotak sejajar tepi kiri ikon; kalau tidak muat di
 * kanan layar, kotak dibalik sejajar tepi kanan ikon dan panah tetap di bawah ikon.
 */
export default function MahasiswaTooltip({ anchor, children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!anchor || !ref.current) {
      setPos(null);
      return;
    }

    const width = ref.current.offsetWidth;
    const centerX = anchor.left + anchor.width / 2;

    let left = anchor.left;
    if (left + width > window.innerWidth - EDGE) left = anchor.right - width;
    left = Math.max(EDGE, left);

    setPos({ top: anchor.bottom + GAP, left, pointer: centerX - left - 8 });
  }, [anchor]);

  if (!anchor) return null;

  return createPortal(
    <div
      ref={ref}
      id="mahasiswa-tooltip"
      role="tooltip"
      className="mahasiswa-tooltip"
      style={{
        top: pos ? pos.top : anchor.bottom + GAP,
        left: pos ? pos.left : anchor.left,
        visibility: pos ? 'visible' : 'hidden',
        '--pointer-left': `${pos ? pos.pointer : 17}px`,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
