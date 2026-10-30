import { useEffect, useState } from "react";
import { updateMateri } from "../../services/materiService.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "pptx"];

function getCurrentFileName(url = "") {
  if (!url) return "File tidak tersedia";

  try {
    const fileName = decodeURIComponent(
      new URL(url, window.location.origin).pathname.split("/").pop() || ""
    );

    // Hilangkan awalan UUID yang ditambahkan backend saat upload.
    return fileName.replace(/^[a-f0-9]{32}_/i, "") || "File materi";
  } catch {
    return url.split("/").pop() || "File materi";
  }
}

export default function EditMateriModal({
  materi,
  mataKuliahOptions = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    judul: materi.judul || "",
    semester: String(materi.semester || ""),
    mata_kuliah: materi.mata_kuliah || "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentFileName = getCurrentFileName(materi.url);
  const displayedFileName = file?.name || currentFileName;
  const displayedFileType =
    displayedFileName.split(".").pop()?.toUpperCase() || "";

  const options = [
    ...new Set([...mataKuliahOptions, materi.mata_kuliah].filter(Boolean)),
  ];

  useEffect(() => {
    document.body.classList.add("edit-materi-modal-open");

    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving && !saved) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("edit-materi-modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving, saved]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      event.target.value = "";
      setFile(null);
      setError("Format file harus PDF, DOCX, atau PPTX.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      event.target.value = "";
      setFile(null);
      setError("Ukuran file maksimal 10 MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.judul.trim()) {
      setError("Nama materi wajib diisi.");
      return;
    }

    if (!form.semester || !form.mata_kuliah.trim()) {
      setError("Semester dan mata kuliah wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("judul", form.judul.trim());
    formData.append("semester", form.semester);
    formData.append("mata_kuliah", form.mata_kuliah.trim());

    // File hanya dikirim jika admin memilih file pengganti.
    if (file) {
      formData.append("file", file);
    }

    try {
      setSaving(true);

      // Popup sukses hanya tampil jika backend merespons berhasil.
      await updateMateri(materi.id, formData);
      setSaved(true);

      window.setTimeout(() => {
        onSaved?.();
      }, 1800);
    } catch (err) {
      setError(err.message || "Gagal menyimpan perubahan materi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="edit-materi-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving &&
          !saved
        ) {
          onClose();
        }
      }}
    >
      {saved ? (
        <section
          className="edit-materi-success"
          role="status"
          aria-live="polite"
        >
          <div className="edit-materi-success-icon" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none">
              <circle
                cx="60"
                cy="60"
                r="43"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                d="m39 61 14 14 29-31"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2>Materi Berhasil Diperbarui!</h2>
          <p>
            Materi <strong>&quot;{form.judul.trim()}&quot;</strong> telah
            berhasil diperbarui!
          </p>
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
                <path
                  d="M36 13H15a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h34a4 4 0 0 0 4-4V31"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m29 39 3-10L51 10a5 5 0 0 1 7 7L39 36l-10 3Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 id="edit-materi-title">Edit Materi</h2>

            <button
              className="edit-materi-close"
              type="button"
              onClick={onClose}
              aria-label="Tutup popup"
              disabled={saving}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <form className="edit-materi-form" onSubmit={handleSubmit}>
            <div className="edit-materi-section-title">
              1. Informasi Materi
            </div>

            <div className="edit-materi-fields">
              <label className="edit-materi-field">
                <span>
                  Semester<span className="required-mark">*</span>
                </span>

                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Pilih semester
                  </option>

                  {Array.from({ length: 8 }, (_, index) => index + 1).map(
                    (semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="edit-materi-field">
                <span>
                  Mata Kuliah<span className="required-mark">*</span>
                </span>

                <select
                  name="mata_kuliah"
                  value={form.mata_kuliah}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Pilih mata kuliah
                  </option>

                  {options.map((mataKuliah) => (
                    <option key={mataKuliah} value={mataKuliah}>
                      {mataKuliah}
                    </option>
                  ))}
                </select>
              </label>

              <label className="edit-materi-field edit-materi-field-full">
                <span>
                  Nama Materi<span className="required-mark">*</span>
                </span>

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
                <div className="edit-materi-file-icon" aria-hidden="true">
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

                <div className="edit-materi-file-meta">
                  <span className="edit-materi-file-name">
                    {displayedFileName}
                  </span>
                  <span className="edit-materi-file-type">
                    {displayedFileType}
                  </span>
                </div>

                <label className="edit-materi-change-file">
                  Ganti File
                  <input
                    type="file"
                    accept=".pdf,.docx,.pptx"
                    onChange={handleFileChange}
                    disabled={saving}
                  />
                </label>
              </div>

              <p className="edit-materi-file-hint">
                Format: PDF, DOCX, PPTX | Maks. 10 MB. Kosongkan jika file
                tidak diganti.
              </p>
            </section>

            {error && (
              <p className="edit-materi-error" role="alert">
                {error}
              </p>
            )}

            <footer className="edit-materi-actions">
              <button
                type="button"
                className="edit-materi-cancel"
                onClick={onClose}
                disabled={saving}
              >
                Batal
              </button>

              <button
                type="submit"
                className="edit-materi-save"
                disabled={saving}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9M18 2l4 4-11 11-5 1 1-5L18 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </footer>
          </form>
        </section>
      )}
    </div>
  );
}