// src/components/common/ErrorBoundary.jsx
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error(error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="app-error" role="alert">
        <h2>Halaman gagal dimuat</h2>
        <p>Terjadi masalah saat menampilkan halaman. Periksa koneksi internet Anda, lalu muat ulang.</p>
        <button type="button" onClick={() => window.location.reload()}>Muat ulang</button>
      </div>
    );
  }
}