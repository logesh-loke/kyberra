
import React, { useRef, useState } from "react";
import Toolbar from "src/components/mailbox/toolbar/Toolbar";

export default function DraftRichPasteEditor({
  value = "",
  onChange,
  placeholder,
  maxLength = 10000,
  onError,
}) {
  const editorRef = useRef(null);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const getTextLength = () => editorRef.current.innerText.length;
const lastPasteWasHtmlRef = useRef(false);

  const updateCharCount = () => {
    const len = getTextLength();
    setCharCount(len);
  };

  
const handleEditorClick = (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  e.preventDefault();
  window.open(link.href, "_blank", "noopener,noreferrer");
};


const linkifyHtml = (html) => {
  const container = document.createElement("div");
  container.innerHTML = html;

  const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/gi;

  const walk = (node) => {
    //  Skip existing links
    if (node.nodeName === "A") return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!urlRegex.test(text)) return;

      const span = document.createElement("span");
      span.innerHTML = text.replace(urlRegex, (url) => {
        const href = url.startsWith("http") ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });

      node.replaceWith(...span.childNodes);
      return;
    }

    node.childNodes.forEach(walk);
  };

  walk(container);
  return container.innerHTML;
};


const keepCursor = (el) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
};

  // const handleInput = () => {
  //   const len = getTextLength();
  //   updateCharCount();

  //   if (len > maxLength) {
  //     setError(`Max limit ${maxLength} characters reached`);
  //     onError && onError("limit_exceeded");

  //     const trimmed = editorRef.current.innerText.slice(0, maxLength);
  //     editorRef.current.innerText = trimmed;

  //     return;
  //   }

  //   setError("");
  //   onChange && onChange(editorRef.current.innerHTML);
  // };

  const handleInput = () => {
  const len = getTextLength();
  updateCharCount();

  if (len > maxLength) {
    setError(`Max limit ${maxLength} characters reached`);
    onError && onError("limit_exceeded");

    const trimmed = editorRef.current.innerText.slice(0, maxLength);
    editorRef.current.innerText = trimmed;
    return;
  }

  setError("");

  // ✅ 1️⃣ If last paste was HTML → do nothing
  if (lastPasteWasHtmlRef.current) {
    lastPasteWasHtmlRef.current = false;
    onChange && onChange(editorRef.current.innerHTML);
    return;
  }

  // ✅ 2️⃣ IF USER USED TOOLBAR FORMATTING → DO NOT RELINKIFY
  if (
    document.queryCommandState("bold") ||
    document.queryCommandState("italic") ||
    document.queryCommandState("underline") ||
    document.queryCommandState("insertUnorderedList") ||
    document.queryCommandState("insertOrderedList")
  ) {
    onChange && onChange(editorRef.current.innerHTML);
    return;
  }

  // ✅ 3️⃣ ONLY plain text reaches here
  let html = editorRef.current.innerHTML;
  const linkedHtml = linkifyHtml(html);

  if (linkedHtml !== html) {
    editorRef.current.innerHTML = linkedHtml;
    keepCursor(editorRef.current);
  }

  onChange && onChange(editorRef.current.innerHTML);
};


  const formatPlainTextLikeGmail = (text) => {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")        // normalize newlines
    .replace(/\n{3,}/g, "\n\n")    // collapse excessive gaps
    .split(/\n{2,}/)               // paragraph breaks
    .map(block => {
      const safe = block
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `<p>${safe.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
};

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    const currentLength = getTextLength();
    const pasteLength = text.length;

    if (currentLength + pasteLength > maxLength) {
      setError(`Paste exceeds ${maxLength} characters`);
      onError && onError("paste_limit_exceeded");
      return;
    }

    
  //  HTML → insert AS-IS (NO conversion)
  if (html) {
    lastPasteWasHtmlRef.current = true;

    document.execCommand("insertHTML", false, html);
    onChange && onChange(editorRef.current.innerHTML);
    return;
  }

  //  Plain text → convert
  if (text) {
    lastPasteWasHtmlRef.current = false;

    const gmailHtml = formatPlainTextLikeGmail(text);
    document.execCommand("insertHTML", false, gmailHtml);
    handleInput(); // safe here

    // document.execCommand("insertHTML", false, html || text);
    // handleInput();
  };
}

  // Format count (e.g., 8 -> 008/10000)
  const formatCount = String(charCount).padStart(2, "0");

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[250px] border rounded p-3 text-sm bg-white focus:outline-none overflow-auto"
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Live counter */}
      <div className="absolute bottom-2 right-3 text-xs text-gray-500">
        {formatCount}/{maxLength}
      </div>
      <Toolbar editorRef={editorRef} />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
