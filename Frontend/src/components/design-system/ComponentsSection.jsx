// src/components/design-system/ComponentsSection.jsx
// Section: Components — semua komponen UI reusable

export default function ComponentsSection() {
  return (
    <section className="ds-section" id="components">
      <header className="ds-section-header">
        <span className="ds-section-number">04</span>
        <h2 className="ds-section-title">Components</h2>
        <p className="ds-section-desc">
          Komponen UI yang sudah tersedia di aplikasi. Semua sudah style-nya
          konsisten.
        </p>
      </header>

      {/* Buttons */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Buttons</h3>

        <div className="ds-component-preview">
          <div className="ds-component-demo">
            <button className="btn-primary" type="button">
              Primary Button
            </button>
          </div>
          <div className="ds-component-demo">
            <button className="btn-primary" disabled type="button">
              Disabled Button
            </button>
          </div>
        </div>
        <pre className="ds-component-code">
{`<button className="btn-primary">Primary</button>
<button className="btn-primary" disabled>Disabled</button>`}
        </pre>
      </div>

      {/* Inputs */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Input Fields</h3>

        <div className="ds-component-preview ds-component-preview--block">
          <div className="ds-component-demo ds-component-demo--full">
            <div className="input-field">
              <label htmlFor="ds-input-normal">Label Normal</label>
              <input
                id="ds-input-normal"
                type="text"
                placeholder="Placeholder text"
              />
            </div>
          </div>

          <div className="ds-component-demo ds-component-demo--full">
            <div className="input-field">
              <label htmlFor="ds-input-error">Label Error</label>
              <input
                id="ds-input-error"
                type="text"
                placeholder="Value salah"
                className="input-error"
                defaultValue="value salah"
              />
            </div>
          </div>
        </div>
        <pre className="ds-component-code">
{`<div className="input-field">
  <label htmlFor="id">Label</label>
  <input id="id" type="text" />
</div>`}
        </pre>
      </div>

      {/* Alerts */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Alerts</h3>

        <div className="ds-component-preview ds-component-preview--block">
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">!</span>
            <span>Pesan error</span>
          </div>

          <div className="alert alert-success" role="status">
            <span className="alert-icon">✓</span>
            <span>Pesan sukses</span>
          </div>
        </div>
        <pre className="ds-component-code">
{`<div className="alert alert-error">
  <span className="alert-icon">!</span>
  <span>Pesan error</span>
</div>`}
        </pre>
      </div>

      {/* Cards */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Cards</h3>

        <div className="ds-component-preview">
          <div className="ds-component-demo">
            <div className="ds-demo-card">
              <h4 className="ds-demo-card-title">Card Title</h4>
              <p className="ds-demo-card-desc">
                Ini contoh card. Dipakai untuk membungkus konten terkait.
              </p>
            </div>
          </div>
        </div>
        <pre className="ds-component-code">
{`<div className="auth-card">
  <h1 className="auth-title">Title</h1>
  <p className="auth-subtitle">Description</p>
</div>`}
        </pre>
      </div>
    </section>
  );
}