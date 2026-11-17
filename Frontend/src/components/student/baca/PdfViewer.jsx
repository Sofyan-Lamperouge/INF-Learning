// src/components/student/baca/PdfViewer.jsx
// Viewer PDF berbasis pdf.js (pin: pdfjs-dist@3.11.174). Halaman digambar lazy saat terlihat.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { unduhBlob } from '../../../services/bacaMateriService.js';
import { ScrollDownIcon, MinusIcon, PlusIcon, ExpandIcon, CollapseIcon } from './BacaIcons.jsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_STEP = 25;

function Halaman({ doc, nomor, lebar, rasio, root }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [terlihat, setTerlihat] = useState(false);
  const [tinggi, setTinggi] = useState(Math.round(lebar * rasio));

  useEffect(() => {
    setTinggi(Math.round(lebar * rasio));
  }, [lebar, rasio]);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !root.current) return undefined;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setTerlihat(true),
      { root: root.current, rootMargin: '800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    if (!terlihat || !doc) return undefined;
    let batal = false;
    let task;
    (async () => {
      const page = await doc.getPage(nomor);
      if (batal) return;
      const dasar = page.getViewport({ scale: 1 });
      const skala = lebar / dasar.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vp = page.getViewport({ scale: skala * dpr });
      const c = canvas.current;
      if (!c) return;
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      c.style.width = `${Math.floor(lebar)}px`;
      c.style.height = `${Math.floor(vp.height / dpr)}px`;
      setTinggi(Math.floor(vp.height / dpr));
      task = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
      try {
        await task.promise;
      } catch {
        /* render dibatalkan saat zoom berubah */
      }
    })();
    return () => {
      batal = true;
      if (task) task.cancel();
    };
  }, [terlihat, doc, nomor, lebar]);

  return (
    <div
      ref={wrap}
      className="bm-page"
      data-page={nomor}
      style={{ width: lebar, height: tinggi }}
      aria-label={`Halaman ${nomor}`}
    >
      <canvas ref={canvas} />
    </div>
  );
}

export default function PdfViewer({ materiId, namaFile }) {
  const kartu = useRef(null);
  const area = useRef(null);
  const [doc, setDoc] = useState(null);
  const [total, setTotal] = useState(0);
  const [rasio, setRasio] = useState(1.414);
  const [halaman, setHalaman] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [lebarArea, setLebarArea] = useState(0);
  const [layarPenuh, setLayarPenuh] = useState(false);
  const [galat, setGalat] = useState('');
  const [memuat, setMemuat] = useState(true);

  // Muat dokumen: file diambil dulu sebagai data (fetch), lalu diberikan ke pdf.js.
  // Cara ini sama dengan tombol Unduh dan tidak bergantung pada range-request.
  useEffect(() => {
    let batal = false;
    const ctrl = new AbortController();
    let task;
    setMemuat(true);
    setGalat('');
    (async () => {
      try {
        const { blob } = await unduhBlob(materiId, ctrl.signal);
        const data = await blob.arrayBuffer();
        task = pdfjsLib.getDocument({ data });
        const d = await task.promise;
        const p1 = await d.getPage(1);
        if (batal) return;
        const vp = p1.getViewport({ scale: 1 });
        setRasio(vp.height / vp.width);
        setTotal(d.numPages);
        setDoc(d);
        setHalaman(1);
        setMemuat(false);
      } catch (e) {
        if (batal) return;
        console.error('[PdfViewer] gagal memuat materi', materiId, e);
        setGalat(e?.message || 'Tidak diketahui');
        setMemuat(false);
      }
    })();
    return () => {
      batal = true;
      ctrl.abort();
      if (task) task.destroy();
    };
  }, [materiId]);

  // Ukur lebar area
  useEffect(() => {
    const el = area.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setLebarArea(el.clientWidth));
    ro.observe(el);
    setLebarArea(el.clientWidth);
    return () => ro.disconnect();
  }, [doc]);

  useEffect(() => {
    const f = () => setLayarPenuh(document.fullscreenElement === kartu.current);
    document.addEventListener('fullscreenchange', f);
    return () => document.removeEventListener('fullscreenchange', f);
  }, []);

  const lebarFit = lebarArea >= 720 ? lebarArea * 0.67 : Math.max(lebarArea - 56, 120);
  const lebarHalaman = Math.round((lebarFit * zoom) / 100);

  const hitungHalaman = useCallback(() => {
    const el = area.current;
    if (!el) return;
    const batas = el.scrollTop + el.clientHeight / 3;
    let aktif = 1;
    el.querySelectorAll('.bm-page').forEach((p) => {
      if (p.offsetTop <= batas) aktif = Number(p.dataset.page);
    });
    setHalaman(aktif);
  }, []);

  function ubahZoom(arah) {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + arah * ZOOM_STEP)));
  }

  function toggleLayarPenuh() {
    if (document.fullscreenElement) document.exitFullscreen();
    else kartu.current?.requestFullscreen?.();
  }

  return (
    <section ref={kartu} className={`bm-viewer${layarPenuh ? ' bm-viewer-penuh' : ''}`}>
      <div className="bm-toolbar">
        <div className="bm-toolbar-kiri">
          <ScrollDownIcon className="bm-toolbar-ikon" />
          <strong className="bm-halaman">{total ? `${halaman}/${total}` : '–'}</strong>
          <span className="bm-petunjuk">Gulir ke bawah untuk membaca</span>
        </div>
        <div className="bm-toolbar-kanan">
          <button type="button" className="bm-tool" onClick={() => ubahZoom(-1)} disabled={zoom <= ZOOM_MIN} aria-label="Perkecil">
            <MinusIcon />
          </button>
          <span className="bm-zoom" aria-live="polite">{zoom}%</span>
          <button type="button" className="bm-tool" onClick={() => ubahZoom(1)} disabled={zoom >= ZOOM_MAX} aria-label="Perbesar">
            <PlusIcon />
          </button>
          <button type="button" className="bm-tool" onClick={toggleLayarPenuh} aria-label={layarPenuh ? 'Keluar layar penuh' : 'Layar penuh'}>
            {layarPenuh ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        </div>
      </div>

      <div className="bm-area" ref={area} onScroll={hitungHalaman} tabIndex={0}>
        {memuat && <p className="bm-status">Memuat dokumen...</p>}
        {galat && (
          <p className="bm-status bm-status-gagal">
            Dokumen tidak dapat ditampilkan. Silakan unduh materi.
            <br />
            <small>({galat})</small>
          </p>
        )}
        {doc && lebarArea > 0 && (
          <div className="bm-pages" style={{ minWidth: lebarHalaman + 48 }}>
            {Array.from({ length: total }, (_, i) => (
              <Halaman key={i + 1} doc={doc} nomor={i + 1} lebar={lebarHalaman} rasio={rasio} root={area} />
            ))}
          </div>
        )}
      </div>

      <div className="bm-footer">{namaFile}</div>
    </section>
  );
}
