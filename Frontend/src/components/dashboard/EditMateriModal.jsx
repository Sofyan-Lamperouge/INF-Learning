import { useEffect, useState } from "react";
import { updateMateri } from "../../services/materiService.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "pptx"];

function getCurrentFileName(url = "") {
  if (!url) return "File tidak tersedia";

  try {
    const storedName = decodeURIComponent(
      new URL(url, window.location.origin).pathname.split("/").pop() || ""
    );
    // Backend lama menyimpan nama sebagai UUID.ext. Hilangkan UUID jika ada.
    const readableName = storedName.replace(/^[a-f0-9]{32}_/i, "");
    return readableName.replace(/^([a-f0-9]{32})(\.(?:pdf|docx|pptx))$/i, "Materi$2") || readableName;
  } catch {
    return url.split("/").pop() || "File materi";
  }
}

function FileTypeIcon({ extension }) {
  return (
    <div className={`edit-materi-file-icon edit-materi-file-icon--${extension}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path
          d="M13 5h14l11 11v25a2 2 0 0 1-2 2H13a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M27 5v10a2 2 0 0 0 2 2h9"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

function ResultIcon({ type }) {
  if (type === "success") {
    return (
      <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="43" stroke="currentColor" strokeWidth="5" />
        <path d="m39 61 14 14 29-31" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="m40 40 40 40M80 40 40 80" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export default function EditMateriModal({
  materi,
  mataKuliahOptions = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    semester: String(materi.semester ?? ""),
    mata_kuliah: materi.mata_kuliah ?? "",
    judul: materi.judul ?? "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const options = [...new Set([...mataKuliahOptions, materi.mata_kuliah].filter(Boolean))];
  const currentFileName = getCurrentFileName(materi.url);
  const visibleFileName = file?.name || currentFileName;
  const extension = visibleFileName.split(".").pop()?.toLowerCase() || "file";
  const fileType = extension.toUpperCase();

  useEffect(() => {
    document.documentElement.classList.add("edit-materi-modal-open");
    document.body.classList.add("edit-materi-modal-open");

    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving && !result) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("edit-materi-modal-open");
      document.body.classList.remove("edit-materi-modal-open");
    };
  }, [onClose, saving, result]);

  function showError(message) {
    setResult({ type: "error", message });
    window.setTimeout(() => setResult(null), 2600);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;

    const selectedExtension = selected.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(selectedExtension)) {
      event.target.value = "";
      setFile(null);
      showError("Format file harus PDF, DOCX, atau PPTX.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setFile(null);
      showError("Ukuran file maksimal 10 MB.");
      return;
    }

    setFile(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.semester || !form.mata_kuliah.trim() || !form.judul.trim()) {
      showError("Semester, mata kuliah, dan nama materi wajib diisi.");
      return;
    }

    if (form.judul.trim().length < 3) {
      showError("Nama materi minimal terdiri dari 3 karakter.");
      return;
    }

    const formData = new FormData();
    formData.append("judul", form.judul.trim());
    formData.append("semester", form.semester);
    formData.append("mata_kuliah", form.mata_kuliah.trim());
    if (file) formData.append("file", file);

    try {
      setSaving(true);
      await updateMateri(materi.id, formData);
      setResult({ type: "success", message: `Data “${form.judul.trim()}” telah berhasil diperbarui!` });
      window.setTimeout(() => onSaved?.(), 2100);
    } catch (error) {
      setResult({
        type: "error",
        message: error.message || "Terjadi kesalahan saat memperbarui materi. Silakan coba lagi.",
      });
      window.setTimeout(() => setResult(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="edit-materi-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving && !result) onClose();
      }}
    >
      {result ? (
        <section
          className={`edit-materi-result edit-materi-result--${result.type}`}
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
        >
          <div className="edit-materi-result-icon">
            <ResultIcon type={result.type} />
          </div>
          <h2>{result.type === "success" ? "Materi Berhasil Diperbarui!" : "Gagal Memperbarui Materi!"}</h2>
          <p>{result.message}</p>
        </section>
      ) : (
        <section
          className="edit-materi-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-materi-title"
        >
          <header className="edit-materi-header">
            <div className="edit-materi-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <path d="M36 13H15a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h34a4 4 0 0 0 4-4V31" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m29 39-1-10L49 8a5 5 0 0 1 7 7L35 36l-6 3Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="edit-materi-title">Edit Materi</h2>
            <button className="edit-materi-close" type="button" onClick={onClose} aria-label="Tutup" disabled={saving}>
              <svg viewBox="0 0 24 24" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          </header>

          <form className="edit-materi-form" onSubmit={handleSubmit} noValidate>
            <div className="edit-materi-section-title">1. Informasi Materi</div>

            <div className="edit-materi-fields">
              <label className="edit-materi-field">
                <span>Semester<span className="edit-materi-required">*</span></span>
                <select name="semester" value={form.semester} onChange={handleChange} required>
                  <option value="" disabled>Pilih semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                    <option key={semester} value={semester}>Semester {semester}</option>
                  ))}
                </select>
              </label>

              <label className="edit-materi-field">
                <span>Mata Kuliah<span className="edit-materi-required">*</span></span>
                <select name="mata_kuliah" value={form.mata_kuliah} onChange={handleChange} required>
                  <option value="" disabled>Pilih mata kuliah</option>
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>

              <label className="edit-materi-field edit-materi-field-full">
                <span>Nama Materi<span className="edit-materi-required">*</span></span>
                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={200}
                  required
                />
              </label>
            </div>

            <section className="edit-materi-file-section">
              <h3>File Materi</h3>
              <div className="edit-materi-file-row">
                <FileTypeIcon extension={extension} />
                <div className="edit-materi-file-meta">
                  <span className="edit-materi-file-name">{visibleFileName}</span>
                  <span className={`edit-materi-file-type edit-materi-file-type--${extension}`}>{fileType}</span>
                </div>
                <label className="edit-materi-change-file">
                  Ganti File
                  <input type="file" accept=".pdf,.docx,.pptx" onChange={handleFileChange} disabled={saving} />
                </label>
              </div>
              <p className="edit-materi-file-hint">Format: PDF, DOCX, PPTX | Maks. 10 MB. Kosongkan jika file tidak diganti.</p>
            </section>

            <footer className="edit-materi-actions">
              <button type="button" className="edit-materi-cancel" onClick={onClose} disabled={saving}>Batal</button>
              <button type="submit" className="edit-materi-save" disabled={saving}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9M18 2l4 4-11 11-5 1 1-5L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </footer>
          </form>
        </section>
      )}
    </div>
  );
}
