// src/utils/encryptUtils.js
// AES-256-GCM encryption using a single master key loaded from CRA .env

// ----------------- Base64 helpers -----------------
const abToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

const base64ToAb = (b64) => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

// ----------------- Cached CryptoKey -----------------
let cachedCryptoKey = null;

// ---------------------------------------------------
// Correct CRA-safe env loader
// ---------------------------------------------------
function getMasterKeyBase64FromEnv() {
  // CRA — this is replaced at build time even though `process` is NOT defined at runtime
  if (process.env.REACT_APP_MASTER_KEY) {
    return process.env.REACT_APP_MASTER_KEY;
  }

  // Optional: runtime injection fallback
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
    ["encrypt", "decrypt"]
  );

  cachedCryptoKey = key;
  return key;
}

// ---------------------------------------------------
// Encrypt ArrayBuffer
// ---------------------------------------------------
async function _encryptArrayBuffer(plainBuf) {
  const key = await getMasterCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plainBuf
  );

  return {
    ivB64: abToBase64(iv.buffer),
    ciphertextB64: abToBase64(ciphertext),
  };
}

// ---------------------------------------------------
// Encrypt text
// ---------------------------------------------------
export async function encripttext(message) {
  if (typeof message !== "string") {
    throw new Error("encripttext: message must be a string");
  }

  const buf = new TextEncoder().encode(message).buffer;
  const pkg = await _encryptArrayBuffer(buf);

  return {
    ciphertext: pkg.ciphertextB64,
    iv: pkg.ivB64,
    meta: { type: "text" },
  };
}

// ---------------------------------------------------
// Encrypt file / blob / arraybuffer
// ---------------------------------------------------
// export async function encriptfile(fileOrArrayBuffer) {
//   let buf;
//   const meta = { type: "file" };

//   if (fileOrArrayBuffer instanceof ArrayBuffer) {
//     buf = fileOrArrayBuffer;
//   } else if (typeof fileOrArrayBuffer?.arrayBuffer === "function") {
//     buf = await fileOrArrayBuffer.arrayBuffer();
//     meta.filename = fileOrArrayBuffer.name;
//     meta.mimeType = fileOrArrayBuffer.type;
//   } else {
//     throw new Error("encriptfile: expected File/Blob/ArrayBuffer");
//   }

//   const pkg = await _encryptArrayBuffer(buf);

//   return {
//     ciphertext: pkg.ciphertextB64,
//     iv: pkg.ivB64,
//     meta,
//   };
// }

// ---------------------------------------------------
// Encrypt file(s): File | Blob | ArrayBuffer | Array
// ---------------------------------------------------
export async function encriptfile(input) {
  // 🔹 Always normalize to array
  const items = Array.isArray(input) ? input : [input];

  const encryptedResults = [];

  for (const item of items) {
    let buf;
    const meta = { type: "file" };

    // 🔹 Handle objects like { file, name, size }
    const file = item?.file ?? item;

    if (file instanceof ArrayBuffer) {
      buf = file;
    } 
    else if (typeof file?.arrayBuffer === "function") {
      buf = await file.arrayBuffer();
      meta.filename = file.name;
      meta.mimeType = file.type;
      // meta.size = file.size;
    } 
    else {
      throw new Error(
        "encriptfile: expected File/Blob/ArrayBuffer or array of them"
      );
    }

    const pkg = await _encryptArrayBuffer(buf);

    encryptedResults.push({
      ciphertext: pkg.ciphertextB64,
      iv: pkg.ivB64,
      meta,
    });
  }

  return encryptedResults; //  ALWAYS ARRAY
}

// ---------------------------------------------------
export function clearMasterKeyCache() {
  cachedCryptoKey = null;
}
