import { useState } from "react";

export default function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  placeholder = "Masukkan Password",
  error = "",
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <div className={`input-with-icon ${error ? "input-error" : ""}`}>
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="icon-btn"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}