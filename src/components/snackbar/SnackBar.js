import { createPortal } from "react-dom";

export default function SnackBar({ text = "Sending email…" }) {
  return createPortal(
    <div className="fixed bottom-6 left-6 z-[9999]">
      <div className="bg-[#edf2f9] text-[#5683c2] border-2 border-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[260px]">
        <div className="w-4 h-4 border-2 border-[#5683c2] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>,
    document.body
  );
}