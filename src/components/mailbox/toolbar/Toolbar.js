import React, { useEffect, useRef, useState } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
} from "react-icons/fi";
import { MdStrikethroughS } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { BiEraser } from "react-icons/bi";


const Toolbar = ({ editorRef }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [showAlignDropdown, setShowAlignDropdown] = useState(false);
const [showTextStyleDropdown, setShowTextStyleDropdown] = useState(false);

   const emojiPickerRef = useRef(null);
const textStyleRef = useRef(null);
const alignRef = useRef(null);


useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      textStyleRef.current &&
      !textStyleRef.current.contains(e.target)
    ) {
      setShowTextStyleDropdown(false);
    }

    if (
      alignRef.current &&
      !alignRef.current.contains(e.target)
    ) {
      setShowAlignDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


   const openTextStyle = () => {
  setShowTextStyleDropdown((prev) => {
    setShowAlignDropdown(false);
    setShowEmojiPicker(false);
    return !prev;
  });
};

const openAlign = () => {
  setShowAlignDropdown((prev) => {
    setShowTextStyleDropdown(false);
    setShowEmojiPicker(false);
    return !prev;
  });
};

const openEmoji = () => {
  setShowEmojiPicker((prev) => {
    setShowAlignDropdown(false);
    setShowTextStyleDropdown(false);
    return !prev;
  });
};


   const toggleStyle = (key, onValue, offValue) => {
  activeTextStyleRef.current[key] =
    activeTextStyleRef.current[key] === onValue ? offValue : onValue;
};


   useEffect(() => {
  const editor = editorRef.current;
  if (!editor) return;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      requestAnimationFrame(() => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const style = activeTextStyleRef.current;

        const span = document.createElement("span");
        span.style.fontFamily = style.fontFamily;
        span.style.fontSize = style.fontSize;
        span.style.color = style.color;
        span.style.fontWeight = style.fontWeight;
        span.style.fontStyle = style.fontStyle;
        span.style.textDecoration = style.textDecoration;

        span.appendChild(document.createTextNode("\u200B"));
        range.insertNode(span);

        const newRange = document.createRange();
        newRange.setStart(span.firstChild, 1);
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);
      });
    }
  };

  editor.addEventListener("keydown", handleKeyDown);
  return () => editor.removeEventListener("keydown", handleKeyDown);
}, []);



  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest('button[title="Emoji"]')
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const exec = (cmd, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd, false, value);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      exec("createLink", url);
    }
  };

  const insertEmoji = (emoji) => {
    exec("insertText", emoji);
    // setShowEmojiPicker(false);
  };



  // const setFontSize = (size) => {
  //   exec("fontSize", "7"); // Reset to base
  //   exec("styleWithCSS", true);
  //   exec("fontSize", size);
  // };

  const activeTextStyleRef = useRef({
  fontFamily: "Georgia",
  fontSize: "14px",
  color: "#000000",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
});


const setFontSize = (size) => {
  if (!editorRef.current) return;
activeTextStyleRef.current.fontSize = size;

  editorRef.current.focus();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  // ===============================
  // CASE 1️⃣: TEXT IS SELECTED
  // ===============================
  if (!range.collapsed) {
    let node = range.startContainer;

    // If selection is inside a text node
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // ✅ If already inside a span → just update style
    if (node && node.nodeName === "SPAN") {
      node.style.fontSize = size;
      return;
    }

    // ❌ Otherwise → wrap selection
    const span = document.createElement("span");
    span.style.fontSize = size;

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    return;
  }

  // ===============================
  // CASE 2️⃣: CURSOR ONLY (TYPING)
  // ===============================
  const span = document.createElement("span");
  span.style.fontSize = size;
  span.appendChild(document.createTextNode("\u200B"));

  range.insertNode(span);

  const newRange = document.createRange();
  newRange.setStart(span.firstChild, 1);
  newRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(newRange);
};


const clearFormatting = () => {
  if (!editorRef.current) return;

  editorRef.current.focus();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  // If nothing selected → clear entire editor
  if (range.collapsed) {
    range.selectNodeContents(editorRef.current);
  }

  const text = range.toString();

  // Replace selection with plain text only
  document.execCommand("insertText", false, text);
};



  const setTextColor = (color) => {
    activeTextStyleRef.current.color = color;

    exec("foreColor", color);
  };

const setFontFamily = (font) => {
  if (!editorRef.current) return;
activeTextStyleRef.current.fontFamily = font;

  editorRef.current.focus();
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  // ===============================
  // CASE 1️⃣: TEXT SELECTED
  // ===============================
  if (!range.collapsed) {
    let node = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // If already wrapped → update font
    if (node && node.nodeName === "SPAN") {
      node.style.fontFamily = font;
      return;
    }

    const span = document.createElement("span");
    span.style.fontFamily = font;

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    return;
  }

  // ===============================
  // CASE 2️⃣: CURSOR ONLY (TYPING)
  // ===============================
  const span = document.createElement("span");
  span.style.fontFamily = font;
  span.appendChild(document.createTextNode("\u200B"));

  range.insertNode(span);

  const newRange = document.createRange();
  newRange.setStart(span.firstChild, 1);
  newRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(newRange);
};

activeTextStyleRef.current = {
  fontFamily: "Georgia",
  fontSize: "14px",
  color: "#000000",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
};


  const btn = "p-1.5 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 px-3 py-2 relative">

      {/* FONT FAMILY */}
<select
  className="border w-20 rounded py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  onChange={(e) => setFontFamily(e.target.value)}
  defaultValue="Arial"
>
  <option value="Arial">Arial</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="Verdana">Verdana</option>
  <option value="Tahoma">Tahoma</option>
  <option value="Courier New">Courier New</option>
</select>


    
      {/* FONT SIZE */}
      <select
        className="border rounded  py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => setFontSize(e.target.value)}
        defaultValue="14px"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="24px">24px</option>
      </select>

      {/* TEXT COLOR */}
      <div className="relative">
        <input
          type="color"
          className="w-4 h-4 cursor-pointer"
          onChange={(e) => setTextColor(e.target.value)}
          defaultValue="#000000"
          title="Text Color"
        />
      </div>

      <span className="mx-1 h-6 w-px bg-gray-300" />

  {/* TEXT STYLE DROPDOWN */}
<div className="relative" ref={textStyleRef}>
  <button
    type="button"
    className={btn}
    onMouseDown={(e) => e.preventDefault()}
    // onClick={() => setShowTextStyleDropdown((p) => !p)}
    onClick={openTextStyle}
    title="Text Style"
  >
    <FiBold />
  </button>

  {showTextStyleDropdown && (
    <div className="absolute bottom-full left-0 mb-1 bg-white border rounded shadow-md z-50 min-w-[140px]">
      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("bold");
          toggleStyle("fontWeight", "bold", "normal");
          setShowTextStyleDropdown(false);
        }}
      >
        <FiBold /> Bold
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("italic");
          toggleStyle("fontStyle", "italic", "normal");
          setShowTextStyleDropdown(false);
        }}
      >
        <FiItalic /> Italic
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("underline");
          toggleStyle("textDecoration", "underline", "none");
          setShowTextStyleDropdown(false);
        }}
      >
        <FiUnderline /> Underline
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("strikeThrough");
          setShowTextStyleDropdown(false);
        }}
      >
        <MdStrikethroughS /> Strikethrough
      </button>
    </div>
  )}
</div>


      
       {/* EMOJI PICKER */}
<div className="relative">
  <button
    type="button"
    className={btn}
    onMouseDown={(e) => e.preventDefault()}
    // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    onClick={openEmoji}
    title="Emoji"
  >
    <BsEmojiSmile />
  </button>
  
{showEmojiPicker && (
  <div className="absolute bottom-full -left-20 z-50 mb-1" ref={emojiPickerRef}>
    <EmojiPicker
      onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
      width={300}
      height={350}
      previewConfig={{ showPreview: false }}
      skinTonesDisabled
      searchDisabled={false}
      searchPlaceholder="Search..."
      /* You can try adjusting the height to make it more compact */
      style={{ 
        '--epr-header-padding': '4px 8px',
        '--epr-search-input-padding': '6px 8px 6px 32px',
        '--epr-category-navigation-button-size': '24px'
      }}
    />
  </div>
)}
</div>

      <span className="mx-1 h-6 w-px bg-gray-300" />


      {/* <span className="mx-1 h-6 w-px bg-gray-300" /> */}

 {/* ALIGNMENT DROPDOWN */}
<div className="relative" ref={alignRef}>
  <button
    type="button"
    className={btn}
    onMouseDown={(e) => e.preventDefault()}
    // onClick={() => setShowAlignDropdown((p) => !p)}
    onClick={openAlign}
    title="Text Alignment"
  >
    <FiAlignLeft />
  </button>

  {showAlignDropdown && (
<div className="absolute bottom-full -left-10 mb-1 bg-white border rounded shadow-md z-50">
      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("justifyLeft");
          setShowAlignDropdown(false);
        }}
      >
        <FiAlignLeft /> Left
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("justifyCenter");
          setShowAlignDropdown(false);
        }}
      >
        <FiAlignCenter /> Center
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
        onClick={() => {
          exec("justifyRight");
          setShowAlignDropdown(false);
        }}
      >
        <FiAlignRight /> Right
      </button>
    </div>
  )}
</div>


      <span className="mx-1 h-6 w-px bg-gray-300" />

      {/* LINK */}
      <button
        type="button"
        className={btn}
        onMouseDown={(e) => e.preventDefault()}
        onClick={insertLink}
        title="Insert Link"
      >
        <FiLink />
      </button>

     {/* CLEAR FORMATTING */}
<button
  type="button"
  className={btn}
  onMouseDown={(e) => e.preventDefault()}
  onClick={clearFormatting}
  title="Clear formatting"
>
  <BiEraser />
</button>


  
    </div>
  );
};

export default Toolbar;