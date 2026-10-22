export default function ErrorMessage({ message, variant = 'default' }) {
  if (!message) return null;

  // === Varian "field" — teks kecil merah di bawah input ===
  if (variant === 'field') {
    return (
      <div className="field-error" role="alert">
        <span className="field-error-icon">!</span>
        <span>{message}</span>
      </div>
    );
  }

  // === Varian "default" — alert besar (untuk error global) ===
  return (
    <div className="alert alert-error" role="alert">
      <span className="alert-icon">!</span>
      <span>{message}</span>
    </div>
  );
}