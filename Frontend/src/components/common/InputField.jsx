// Komponen input generik dipakai di seluruh form (registrasi, login, dst.)
// supaya gaya dan validasi dasarnya konsisten di satu tempat.
function InputField({ label, name, type = "text", value, onChange, required }) {
  return (
    <label className="input-field">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

export default InputField;
