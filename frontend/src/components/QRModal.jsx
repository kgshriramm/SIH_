import React, { useState } from "react";
import { generateQr } from "../api";

export default function QRModal({ messages, backendBase }) {
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  async function onGenerate() {
    if (!messages || messages.length <= 1) {
      alert("No chat history to share.");
      return;
    }
    setLoading(true);
    try {
      const blob = await generateQr(messages, backendBase);
      const url = URL.createObjectURL(blob);
      setImgUrl(url);
    } catch (e) {
      alert("QR generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3">
      <button onClick={onGenerate} className="px-3 py-2 bg-neutral-800 rounded">Generate Share QR Code</button>
      {loading && <div className="text-gray-400 mt-2">Generating...</div>}
      {imgUrl && (
        <div className="mt-3">
          <img alt="qr" src={imgUrl} className="w-64 h-64 object-contain" />
          <div className="text-sm text-gray-400 mt-2">Scan to open chat in Streamlit frontend.</div>
        </div>
      )}
    </div>
  );
}
