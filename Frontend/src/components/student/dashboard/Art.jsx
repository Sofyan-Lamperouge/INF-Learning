// src/components/student/dashboard/Art.jsx
//
// Gambar dekoratif (maskot / hiasan) dengan kotak berukuran tetap.
// Kalau file gambarnya belum ada, kotaknya tetap menjaga tata letak
// (tidak muncul ikon gambar rusak).

import { useState } from 'react';

export default function Art({ src, className = '' }) {
  const [gagal, setGagal] = useState(false);

  return (
    <span className={`sd-art ${className}`.trim()} aria-hidden="true">
      {!gagal && (
        <img
          src={src}
          alt=""
          draggable={false}
          onError={() => setGagal(true)}
        />
      )}
    </span>
  );
}