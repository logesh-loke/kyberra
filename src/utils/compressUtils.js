// src/utils/compressUtils.js
// Pure text compression (gzip) -> returns base64 string.

// Base64 encoder
const abToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// GZIP compress using CompressionStream or dynamic pako fallback
async function gzipBuffer(arrayBuffer) {
  if (typeof CompressionStream === "function") {
    // Use Blob.stream() for reliable piping
    const blob = new Blob([arrayBuffer]);
    const cs = new CompressionStream("gzip");
    const compressedStream = blob.stream().pipeThrough(cs);
    return await new Response(compressedStream).arrayBuffer();
  }

  // dynamic import pako as fallback
  try {
    const pako = (await import(/* webpackChunkName: "pako" */ "pako")).default;
    return pako.gzip(new Uint8Array(arrayBuffer)).buffer;
  } catch (err) {
    // final fallback if window.pako exists
    if (typeof window !== "undefined" && window.pako && typeof window.pako.gzip === "function") {
      return window.pako.gzip(new Uint8Array(arrayBuffer)).buffer;
    }
    throw new Error(
      "gzip not supported. Install 'pako' (npm i pako) or use a modern browser with CompressionStream."
    );
  }
}

// compressText(text) -> base64(gzip(text))
export async function compressText(text) {
  if (typeof text !== "string") {
    throw new Error("compressText: input must be string");
  }

  const buf = new TextEncoder().encode(text).buffer;
  const gz = await gzipBuffer(buf);
  return abToBase64(gz);
}
