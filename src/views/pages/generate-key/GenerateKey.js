// GenerateAndStoreMasterKey.jsx
import React, { useState } from "react";
import { FiCopy, FiDownload, FiTrash2, FiShield } from "react-icons/fi";

/**
 * Admin-only AES-256 master key generator (no server upload).
 *
 * - Generates a 32-byte (256-bit) random key using Web Crypto.
 * - Exports key as base64 (44 chars including '=').
 * - Allows Copy, Download, or Clear.
 *
 * SECURITY:
 * - Do NOT embed this key in client bundles.
 * - Move the downloaded key to your server vault / KMS manually.
 * - After generation, clear the key from memory.
 *
 * Usage: render this component on a protected admin page (HTTPS).
 */

function abToBase64(buffer) {
  const u8 = new Uint8Array(buffer);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

export default function GenerateAndStoreMasterKey() {
  const [keyB64, setKeyB64] = useState("");
  const [status, setStatus] = useState(""); // idle | generated | cleared | error
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const validateKey = (b64) => {
    if (!b64 || typeof b64 !== "string") return false;
    try {
      const bytes = base64ToBytes(b64.trim());
      return bytes.length === 32; // 256 bits
    } catch (e) {
      return false;
    }
  };

  const generateKey = async () => {
    setBusy(true);
    setMessage("");
    try {
      const cryptoKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const raw = await window.crypto.subtle.exportKey("raw", cryptoKey); // ArrayBuffer
      const b64 = abToBase64(raw);
      if (!validateKey(b64)) throw new Error("Generated key invalid length");
      setKeyB64(b64);
      setStatus("generated");
      setMessage("Key generated successfully. Please store it securely (server vault/KMS).");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to generate key: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async () => {
    if (!keyB64) return;
    try {
      await navigator.clipboard.writeText(keyB64);
      setMessage("Copied to clipboard — paste carefully (do not share).");
    } catch (e) {
      setMessage("Copy failed. Use manual copy from the textarea.");
    }
  };

  const downloadKeyFile = () => {
    if (!keyB64) return;
    const blob = new Blob([`REACT_APP_MASTER_KEY=${keyB64}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "master_key.env.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage("Downloaded master_key.env.txt — move it to your vault and delete local copies.");
  };

  const clearKeyFromMemory = () => {
    setKeyB64("");
    setStatus("cleared");
    setMessage("Key cleared from memory. If you didn't store it, it is lost.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 text-white">
            <FiShield size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Master Key Generator</h1>
            <p className="text-sm text-gray-500">
              Generate a secure AES-256 master key. This tool is intended for trusted admin machines only.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={generateKey}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:brightness-95 disabled:opacity-60"
              >
                {busy ? "Generating..." : "Generate Key"}
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!keyB64 || busy}
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                <FiCopy /> Copy
              </button>

              <button
                onClick={downloadKeyFile}
                disabled={!keyB64 || busy}
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-60"
              >
                <FiDownload /> Download
              </button>

              <button
                onClick={clearKeyFromMemory}
                disabled={!keyB64 || busy}
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <FiTrash2 /> Clear
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-md text-sm font-medium ${
                status === "generated" ? "bg-green-50 text-green-700" :
                status === "cleared" ? "bg-yellow-50 text-yellow-700" :
                status === "error" ? "bg-red-50 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {status ? status.toUpperCase() : "IDLE"}
              </div>

              {/* <div className="text-xs text-gray-500">
                <div>Algorithm: <span className="font-medium">AES-GCM-256</span></div>
                <div>Key format: <span className="font-medium">base64 (raw)</span></div>
              </div> */}
            </div>
          </div>

          {/* Key display */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">Master Key (base64)</label>
            <textarea
              readOnly
              rows={4}
              value={keyB64}
              className="w-full font-mono p-3 border rounded-md bg-gray-50 text-sm text-gray-800 break-all"
              placeholder="No key generated yet"
            />
            <div className="mt-2 text-xs text-gray-500">
              <strong>Important:</strong> Store this value securely (server vault/KMS). Do not commit the key to source control.
            </div>
          </div>

          {/* Message / tips */}
          {message && (
            <div className="mb-4 p-3 rounded-md bg-gray-50 border text-sm text-gray-700">
              {message}
            </div>
          )}

          {/* Validation helper */}
          <div className="text-xs text-gray-500">
            <p><strong>How to use:</strong> Generate on a trusted admin machine, then copy or download the key and move it to your server-side secret manager (e.g., AWS Secrets Manager, HashiCorp Vault). After storing, click <em>Clear</em> to remove the key from browser memory.</p>
          </div>
        </div>

        {/* footer / warning */}
        <div className="mt-4 text-xs text-gray-500">
          <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded">
            <strong>Security notice:</strong> This page exposes a raw symmetric key. Only run this on secure, private admin machines. Never embed keys in client bundles. Prefer server-side secret management for production.
          </div>
        </div>
      </div>
    </div>
  );
}
