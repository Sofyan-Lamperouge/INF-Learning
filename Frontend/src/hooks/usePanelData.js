import { useEffect, useState } from "react";

// Memuat data untuk SATU panel secara terpisah, sehingga kegagalan satu panel
// tidak menjatuhkan panel lain.
// `fetcher` harus fungsi yang stabil (didefinisikan di luar komponen).
export function usePanelData(fetcher) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: "",
    status: 0,
  });

  useEffect(() => {
    let active = true;

    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: "", status: 200 });
      })
      .catch((err) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: err.message || "Data gagal dimuat.",
            status: err.status ?? 0,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [fetcher]);

  return state;
}