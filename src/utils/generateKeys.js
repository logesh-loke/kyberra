// src/utils/generateKeys.js

// Generate a new RSA public/private key pair
export async function generateKeys() {
  // 1️⃣ Generate key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048, // 2048 bits is standard
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable (so we can export)
    ["encrypt", "decrypt"]
  );

  // 2️⃣ Export public key (JWK format — JSON)
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);

  // 3️⃣ Export private key (PKCS8 — ArrayBuffer → base64)
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

  // 4️⃣ Return both
  return {
    publicKeyJwk,
    privateKeyBase64,
  };
}
