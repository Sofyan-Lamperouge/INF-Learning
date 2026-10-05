export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-success" role="status">
      <span className="alert-icon">✓</span>
      <span>{message}</span>
    </div>
  );
}