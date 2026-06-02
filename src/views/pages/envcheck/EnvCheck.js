import React, { useEffect } from "react";

export default function EnvCheck() {
  useEffect(() => {
    // log the full process.env keys (CRA injects a subset)
    console.log("process.env preview:", Object.keys(process.env).slice(0, 40));
    console.log("REACT_APP_MASTER_KEY raw:", process.env.REACT_APP_MASTER_KEY);
    try {
      const raw = atob(process.env.REACT_APP_MASTER_KEY || "");
      console.log("decoded length:", raw.length);
    } catch (e) {
      console.log("decode error (maybe empty / invalid base64):", e.message);
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Env check — open devtools console</h3>
      <div>Check console for `REACT_APP_MASTER_KEY` and decoded length.</div>
    </div>
  );
}
