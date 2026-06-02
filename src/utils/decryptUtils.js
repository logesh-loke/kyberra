// src/utils/decryptUtils.js
// AES-256-GCM decrypt utilities using a single master key (base64 in env)

// ----------------- Base64 helper -----------------
const base64ToAb = (b64) => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

// ----------------- Cached CryptoKey -----------------
let cachedCryptoKey = null;

// ---------------------------------------------------
function getMasterKeyBase64FromEnv() {
  if (process.env.REACT_APP_MASTER_KEY) {
    return process.env.REACT_APP_MASTER_KEY;
  }

  if (typeof window !== "undefined" && window.__MASTER_KEY_B64__) {
    return window.__MASTER_KEY_B64__;
  }

  return null;
}

// ----------------- Import AES key -----------------
async function getMasterCryptoKey() {
  if (cachedCryptoKey) return cachedCryptoKey;

  const b64 = getMasterKeyBase64FromEnv();
  if (!b64) {
    throw new Error("Master key missing! Set REACT_APP_MASTER_KEY in .env");
  }

  const raw = base64ToAb(b64.trim());

  const key = await window.crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  cachedCryptoKey = key;
  return key;
}

// ---------------------------------------------------
// Internal decrypt helper
// ---------------------------------------------------
async function _decryptToArrayBuffer(pkg) {
  if (!pkg?.ciphertext || !pkg?.iv) {
    throw new Error("_decryptToArrayBuffer: invalid package");
  }

  const key = await getMasterCryptoKey();
  const iv = new Uint8Array(base64ToAb(pkg.iv));
  const cipherBuf = base64ToAb(pkg.ciphertext);

  const plainBuf = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipherBuf
  );

  return plainBuf;
}

// ---------------------------------------------------
// Decrypt text
// ---------------------------------------------------
export async function decripttext(pkg) {
  const buf = await _decryptToArrayBuffer(pkg);
  return new TextDecoder().decode(buf);
}

// ---------------------------------------------------
// Decrypt file
// ---------------------------------------------------
// export async function decriptfile(pkg) {
//   const plainBuf = await _decryptToArrayBuffer(pkg);
//   const blob = new Blob([plainBuf], {
//     type: pkg.meta?.mimeType || "application/octet-stream",
//   });

//   return {
//     blob,
//     url: URL.createObjectURL(blob),
//   };
// }

// ---------------------------------------------------
// Decrypt file(s): accepts single pkg or array
// ---------------------------------------------------
export async function decriptfile(input) {
  // 🔹 Normalize to array
  const items = Array.isArray(input) ? input : [input];

  const results = [];

  for (const pkg of items) {
    const plainBuf = await _decryptToArrayBuffer(pkg);

    const blob = new Blob([plainBuf], {
      type: pkg.meta?.mimeType || "application/octet-stream",
    });

    results.push({
      blob,
      url: URL.createObjectURL(blob),
      meta: pkg.meta || {},
    });
  }

  return results; //  ALWAYS ARRAY
}

// ---------------------------------------------------
export function clearMasterKeyCache() {
  cachedCryptoKey = null;
}
