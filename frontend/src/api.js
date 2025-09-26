import axios from "axios";

const DEFAULT_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export function getBackendBase(useTest = false) {
  return useTest ? `${DEFAULT_BASE}` : DEFAULT_BASE;
}

// POST /api/query
export async function postQuery(query, base = DEFAULT_BASE, timeout = 30000) {
  const url = `${base}/api/query`;
  const resp = await axios.post(url, { query }, { timeout });
  return resp.data;
}

// GET /api/test
export async function getTest(base = DEFAULT_BASE, timeout = 10000) {
  const resp = await axios.get(`${base}/api/test`, { timeout });
  return resp.data;
}

// POST /api/qr_code - returns image/png blob
export async function generateQr(history, base = DEFAULT_BASE, timeout = 30000) {
  const resp = await axios.post(`${base}/api/qr_code`, { history }, {
    timeout,
    responseType: "blob",
  });
  return resp.data; // Blob
}
