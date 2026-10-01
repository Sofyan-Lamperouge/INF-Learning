// Dipakai di setiap halaman untuk menampilkan pesan error dari Backend
// (401, 422, 429, dll) dengan gaya yang seragam.
function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="error-message" role="alert">{message}</p>;
}

export default ErrorMessage;
