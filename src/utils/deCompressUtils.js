// src/utils/decompressUtils.js
// Pure text decompression (gunzip) from a base64-gzip string.
// This file is defensive: if the input is not a base64-gzip payload,
// decompressText() will return the input unchanged instead of throwing.

// NOTE: Uploaded file available at: /mnt/data/5b289660-8f33-4ef5-921b-989a43ce7a75.png

// Normalize and validate base64 string (URL-safe, padding, whitespace)
function normalizeBase64String(b64) {
  if (typeof b64 !== "string") {
    throw new Error("normalizeBase64String: input must be a string");
  }

  let s = b64.replace(/\s+/g, "");

  // unwrap quoted string like: "BASE64..."
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }

  // URL-safe base64 -> standard base64
  s = s.replace(/-/g, "+").replace(/_/g, "/");

  // Fix padding: base64 length must be multiple of 4
  const pad = s.length % 4;
  if (pad === 1) {
    throw new Error("normalizeBase64String: invalid base64 (length mod 4 === 1)");
  } else if (pad === 2) {
    s += "==";
  } else if (pad === 3) {
    s += "=";
  }

  return s;
}

function base64ToUint8ArraySafe(b64) {
  // returns Uint8Array or throws with helpful message
  let normalized;
  try {
    normalized = normalizeBase64String(b64);
  } catch (err) {
    throw new Error("base64ToUint8ArraySafe: normalization failed — " + err.message);
  }

  try {
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    // atob can fail for non-base64 input or characters outside Latin1
    throw new Error(
      "base64ToUint8ArraySafe: atob failed — input is not valid base64 after normalization. Original error: " +
        (err && err.message ? err.message : String(err))
    );
  }
}

// Quick detector: returns true if the string decodes to bytes starting with gzip magic (0x1f 0x8b)
function isLikelyBase64GzipString(s) {
  if (typeof s !== "string") return false;

  // unwrap JSON wrappers and quoted strings quickly (non-throwing)
  let input = s.trim();
  if (input.startsWith("{") && input.endsWith("}")) {
    try {
      const parsed = JSON.parse(input);
      input = parsed.data ?? parsed.payload ?? parsed.base64 ?? input;
    } catch (e) {
      // ignore parse errors
    }
  }
  if (input.startsWith('"') && input.endsWith('"')) input = input.slice(1, -1);

  // Quick rejects: HTML/XML or clearly not base64
  const low = input.slice(0, 10);
  if (low.startsWith("<") || low.startsWith("&lt;") || low.startsWith("<!DOCTYPE")) return false;

  // Normalize a bit (url-safe chars + strip whitespace)
  const maybe = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  // padding check
  const pad = maybe.length % 4;
  if (pad === 1) return false;

  // Try to decode first few bytes only to avoid memory blow (but atob decodes full string)
  try {
    const bytes = base64ToUint8ArraySafe(maybe);
    return bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  } catch {
    return false;
  }
}

// Decompression using DecompressionStream or pako fallback
async function gunzipBuffer(arrayBuffer) {
  if (typeof DecompressionStream === "function") {
    const ds = new DecompressionStream("gzip");
    const compressedStream = new Response(arrayBuffer).body;
    const decompressedStream = compressedStream.pipeThrough(ds);
    return await new Response(decompressedStream).arrayBuffer();
  }

  if (typeof window !== "undefined") {
    try {
      const pako = (await import(/* webpackChunkName: "pako" */ "pako")).default;
      return pako.ungzip(new Uint8Array(arrayBuffer)).buffer;
    } catch {
      if (window.pako && typeof window.pako.ungzip === "function") {
        return window.pako.ungzip(new Uint8Array(arrayBuffer)).buffer;
      }
    }
  }

  throw new Error(
    "gunzip not supported. Use a modern browser with DecompressionStream or install 'pako'."
  );
}

/**
 * decompressText(base64Gz) -> original text
 *
 * Safer behavior:
 * - If the input is not a base64-gzip payload (for example it's already plain HTML/text),
 *   this function returns the input string unchanged.
 * - If the input *is* base64-gzip, it will be decoded and gunzipped and original string returned.
 *
 * This keeps callers simple: call decompressText() on decrypted payloads; if it wasn't compressed,
 * you'll get the original content back.
 */
export async function decompressText(base64CompressedString) {
  if (typeof base64CompressedString !== "string") {
    throw new Error("decompressText: input must be a string (base64 or plain text)");
  }

  // Quick detection
  if (!isLikelyBase64GzipString(base64CompressedString)) {
    // Not base64-gzip — return as-is (safe behavior)
    return base64CompressedString;
  }

  // At this point, we believe it's base64(gzip) — try to decode + gunzip
  let bytes;
  try {
    bytes = base64ToUint8ArraySafe(base64CompressedString);
  } catch (err) {
    // If decoding fails unexpectedly, return original string to avoid crashing the app
    // but include an informative error in console for debugging.
    console.warn("decompressText: base64 decode failed after detection; returning original string. Error:", err);
    return base64CompressedString;
  }

  try {
    const decompressedBuf = await gunzipBuffer(bytes.buffer);
    return new TextDecoder().decode(decompressedBuf);
  } catch (err) {
    // If gunzip fails, log and return original to keep behavior safe
    console.warn("decompressText: gunzip failed; returning original string. Error:", err);
    return base64CompressedString;
  }
}
