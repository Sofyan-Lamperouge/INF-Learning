import { useState } from 'react';

/* ============================================================
   IKON MATA — Inline SVG
   ============================================================ */

// Ikon mata DICORET (eye-invisible)
function EyeInvisibleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
    >
      <path d="M0 0h1024v1024H0z" fill="none" />
      <path
        fill="currentColor"
        d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512C791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5m-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32M149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512m246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512"
      />
      <path
        fill="currentColor"
        d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112"
      />
    </svg>
  );
}

// Ikon mata TERBUKA (eye)
function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
    >
      <path d="M0 0h1024v1024H0z" fill="none" />
      <path
        fill="currentColor"
        d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3c7.7-16.2 7.7-35 0-51.5M512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258s279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766m-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176s176-78.8 176-176s-78.8-176-176-176m0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112s112 50.1 112 112s-50.1 112-112 112"
      />
    </svg>
  );
}


/* ============================================================
   FUNGSI CEK PERSYARATAN PASSWORD
   ============================================================ */
function checkPasswordRequirements(password) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
}

function getStrengthLevel(requirements) {
  const met = Object.values(requirements).filter(Boolean).length;
  if (met === 0) return 'empty';
  if (met < 4) return 'weak';
  return 'strong';
}


/* ============================================================
   KOMPONEN PASSWORD FIELD
   ============================================================ */
export default function PasswordField({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Masukkan Password',
  error = '',
  showStrength = false,
}) {
  const [show, setShow] = useState(false);

  const requirements = checkPasswordRequirements(value);
  const strength = getStrengthLevel(requirements);
  const metCount = Object.values(requirements).filter(Boolean).length;

  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>

      <div className={`input-with-icon ${error ? 'input-error' : ''}`}>
        <input
          id={name}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />

        <button
          type="button"
          className="icon-btn"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {show ? <EyeIcon /> : <EyeInvisibleIcon />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className={`password-strength password-strength--${strength}`}>
          <span className="password-strength-label">Kekuatan</span>

          <div className="password-strength-bars">
            <span className={`password-strength-bar ${metCount >= 1 ? 'active' : ''}`}></span>
            <span className={`password-strength-bar ${metCount >= 2 ? 'active' : ''}`}></span>
            <span className={`password-strength-bar ${metCount >= 3 ? 'active' : ''}`}></span>
            <span className={`password-strength-bar ${metCount >= 4 ? 'active' : ''}`}></span>
          </div>

          <ul className="password-strength-checklist">
            <li className={requirements.minLength ? 'checked' : ''}>
              <span className="password-strength-check">
                {requirements.minLength ? '✓' : ''}
              </span>
              Minimal 8 karakter
            </li>
            <li className={requirements.hasUppercase ? 'checked' : ''}>
              <span className="password-strength-check">
                {requirements.hasUppercase ? '✓' : ''}
              </span>
              Huruf kapital (A–Z)
            </li>
            <li className={requirements.hasNumber ? 'checked' : ''}>
              <span className="password-strength-check">
                {requirements.hasNumber ? '✓' : ''}
              </span>
              Angka (0–9)
            </li>
            <li className={requirements.hasSymbol ? 'checked' : ''}>
              <span className="password-strength-check">
                {requirements.hasSymbol ? '✓' : ''}
              </span>
              Karakter spesial (!@#$)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}