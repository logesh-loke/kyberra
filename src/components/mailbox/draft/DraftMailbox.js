import React, { useState, useRef, useEffect } from "react";
import { GoDash } from "react-icons/go";
import { RxOpenInNewWindow } from "react-icons/rx";
import { IoMdClose, IoMdAttach } from "react-icons/io";
// import RichPasteEditor from "src/utils/RichPasteEditor";
import DraftRichPasteEditor from "src/utils/DraftRichPasteEditor";
import axiosInstance from "src/api/Api";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Decrypt / decompress utilities (used to show incoming response)
import { decripttext } from "src/utils/decryptUtils";
import { decompressText } from "src/utils/deCompressUtils";

// encrypt/compress utils for outgoing payload
import { compressText } from "src/utils/compressUtils";
import { encriptfile, encripttext } from "src/utils/encryptUtils";
import Swal from "sweetalert2";

function EmailInput({ value = [], onChange, placeholder = "" }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const requestemail = (payload) =>
    axiosInstance.get(`/require/find-user?email=${encodeURIComponent(payload.email)}`);

  const { mutate: emailmutate, isLoading: checking } = useMutation({
    mutationFn: requestemail,
    mutationKey: ["checkemail"],
  });

 

  const flushToken = (raw) => {
    if (!raw) return;
    const token = raw.trim().replace(/,$/, "");
    if (!token) return;

    if (value.some((v) => v.toLowerCase() === token.toLowerCase())) {
      setInput("");
      return;
    }

    emailmutate(
      { email: token },
      {
        onSuccess: (res) => {
          if (res?.data?.message === "Success") {
            onChange([...value, token]);
            setInput("");
          } else {
            toast.error(`Email not validated: ${token}`);
            setInput("");
          }
        },
        onError: (err) => {
          const msg = err?.response?.data?.message;
          if (msg === "Email Not Found") {
            toast.error("Email Not Found");
          } else {
            toast.error("Email validation failed");
          }
          setInput("");
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      flushToken(input);
    } else if (e.key === "Backspace" && input === "") {
      if (value.length > 0) onChange(value.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (!text) return;
    const parts = text
      .split(/[\s,;]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of parts) flushToken(p);
  };

  const removeChip = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex items-center gap-2 flex-wrap border-b py-1"
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {value.map((email, idx) => (
        <div
          key={email + idx}
          className="flex items-center gap-2 px-2 py-0.5 rounded-full text-xs mr-1 bg-gray-100 text-gray-800"
        >
          <span>{email}</span>
          <button
            type="button"
            className="text-xs font-bold px-1"
            onClick={() => removeChip(idx)}
          >
            ×
          </button>
        </div>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => flushToken(input)}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] text-sm focus:outline-none px-1 py-1"
      />

      {checking && <span className="text-xs text-gray-400 ml-1">checking...</span>}
    </div>
  );
}

// ---------- Main Component ----------
export default function MailComposeUI({ response = null, onDraftSend }) {
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [visible, setVisible] = useState(true);

  const [messageHtml, setMessageHtml] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  const [toList, setToList] = useState([]);
  const [ccList, setCcList] = useState([]);
  const [bccList, setBccList] = useState([]);

  const [subject, setSubject] = useState("");
  const queryClient = useQueryClient();

   const user = localStorage.getItem('userDetails');
   const userDetails = user ? JSON.parse(user) : null;
   const userId = userDetails?.id;

      const requestsendmail = (payload) => axiosInstance.post('/require/send', payload);
      const draftcloseRequest = (payload) => axiosInstance.put(`/require/draft/${response?.data?.draft_id}`, payload);
      const dreftactionrequest = (payload) => axiosInstance.post('/require/action', payload);

    const { data: sendResponse, mutate: sendMutate, error: sendError } = useMutation({
      mutationFn: requestsendmail,
      mutationKey: ["senddraftmail"],
      
    });

    const { mutate: draftcloseMutate, data: draftcloseResponse, error: draftcloseError } = useMutation({
      mutationFn: draftcloseRequest,
      mutationKey: ["draftclose"],
    });
      const { mutate: dreftactionMutate } = useMutation({
        mutationFn: dreftactionrequest,
        mutationKey: ["dreftaction"],
      });

    useEffect(() => {
      if(draftcloseResponse || draftcloseError){
        if(draftcloseResponse){
          const msg = draftcloseResponse?.data?.message;
          if (msg === "Success") {
            toast.success("Draft Saved Successfully");
            setVisible(false);
          } else {
            toast.error(`Failed to send email: ${msg}`);
          }
        }

           if (draftcloseError?.response?.data?.message === "Internal Server Error") {
                Swal.fire({
              icon: "error",
              title: "Server Error",
              text: "We encountered an unexpected system issue while processing your request. Our technical team has been notified. Please try again in a few moments.",
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: "Understood",
              confirmButtonColor: "#6C72F3",
              backdrop: true,
            });
            }
      }
    
   
    }, [ draftcloseResponse, draftcloseError]);
  
   useEffect(() => {
    if(sendResponse || sendError){
      if(sendResponse){
        const msg = sendResponse?.data?.message;
        if (msg === "Success") {
          dreftactionMutate({
            draft_id: response?.data?.draft_id,
            action_type: "permanently_deleted",
            sender_id: userId
          })
          toast.success("Email sent successfully");
         queryClient.invalidateQueries({ queryKey: ["draft"], exact: false });

           if (onDraftSend) {
          onDraftSend(response?.data?.draft_id);
        }
          setVisible(false);
          
        } else {
          toast.error(`Failed to send email: ${msg}`);
        }
      }

         if (sendError?.response?.data?.message === "Internal Server Error") {
             Swal.fire({
           icon: "error",
           title: "Server Error",
           text: "We encountered an unexpected system issue while processing your request. Our technical team has been notified. Please try again in a few moments.",
           allowOutsideClick: false,
           showConfirmButton: true,
           confirmButtonText: "Understood",
           confirmButtonColor: "#6C72F3",
           backdrop: true,
         });
          }

    }
   
   
   }, [sendResponse, sendError]);

  const doMinimize = () => {
    setMaximized(false);
    setMinimized(true);
  };

  const doRestoreFromMinimized = () => {
    setMinimized(false);
    setMaximized(false);
  };

  const toggleMaximize = () => {
    setMinimized(false);
    setMaximized((m) => !m);
  };

  // Populate UI from incoming response (do not attach response file/preview)
  useEffect(() => {
    if (!response) return;

    if (response?.data?.subject) {
      setSubject(response.data.subject);
    }

    if (Array.isArray(response?.data?.to) && response.data.to.length > 0) {
      const mapped =
        response.data.to
          .map((t) => (typeof t === "string" ? t : t.email || (t.name ? t.name : null)))
          .filter(Boolean) || [];
      setToList(mapped);
    }

    if (Array.isArray(response?.data?.cc) && response.data.cc.length > 0) {
      const mapped =
        response.data.cc
          .map((t) => (typeof t === "string" ? t : t.email || (t.name ? t.name : null)))
          .filter(Boolean) || [];
      setCcList(mapped);
      setShowCC(true);
    }

    if (Array.isArray(response?.data?.bcc) && response.data.bcc.length > 0) {
      const mapped =
        response.data.bcc
          .map((t) => (typeof t === "string" ? t : t.email || (t.name ? t.name : null)))
          .filter(Boolean) || [];
      setBccList(mapped);
      setShowBCC(true);
    }

    // Decrypt incoming message -> decompress -> set to editor
    const handleMessage = async () => {
      try {
        if (response?.data?.message) {
          const decrypted = await decripttext(response.data.message);
          const original = await decompressText(decrypted);
          setMessageHtml(original);
        }
      } catch (err) {
        console.warn("Failed to decrypt/decompress incoming message:", err);
        if (typeof response?.data?.message === "string") {
          setMessageHtml(response.data.message);
        }
      }
    };

    handleMessage();
  }, [response]);

  if (!visible) return null;

  // File upload handler (user-uploaded file only). No preview.
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.warn(`File "${file.name}" exceeds 3 MB. Please upload a smaller file.`);
      e.target.value = "";
      return;
    }
    setAttachedFile({
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    });
    e.target.value = "";
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Build payload: compress+encrypt message, encrypt file (no compress)
  const buildPayload = async () => {
    const out = {
      to: toList.length ? toList : null,
      cc: ccList.length ? ccList : null,
      bcc: bccList.length ? bccList : null,
      subject: subject || null,
      message: null,
      file: null,
    };

    if (messageHtml) {
      // compress -> encrypt
      const compressed = await compressText(messageHtml);
      out.message = await encripttext(compressed);
    }

    if (attachedFile) {
      const fileData = attachedFile.file || attachedFile;
      out.file = await encriptfile(fileData);
    }

    return out;
  };

  // When Send clicked: build payload and console
  const handleSend = async () => {
    try {
      const payload = await buildPayload();
      sendMutate(payload);
    } catch (err) {
      toast.error("Failed to build payload.");
    }
  };

  // When user clicks the header close button: console current payload and close
  const handleCloseAndLog = async () => {
    try {
      const payload = await buildPayload();
      draftcloseMutate(payload);
    } catch (err) {
      console.error("Failed to build payload on close:", err);
    } finally {
      setVisible(false);
    }
  };

  return (
    <div
      className={`fixed z-[1200] transition-all duration-200 ${maximized ? "inset-0 flex justify-center items-start pt-20" : ""
        } ${!maximized ? "right-6 bottom-6" : ""}`}
    >
      {minimized && !maximized && (
        <div
          className="w-60 bg-white shadow-xl border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
          onClick={doRestoreFromMinimized}
        >
          <span className="text-sm font-medium">New Message</span>
          <IoMdClose
            className="text-red-500 hover:bg-gray-100 rounded p-1 cursor-pointer"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAndLog();
            }}
          />
        </div>
      )}

      {!minimized && (
        <div
          className={`bg-white shadow-xl border rounded-lg flex flex-col overflow-hidden transition-all duration-200 ${maximized ? "w-[90%] h-[80vh]" : "w-[500px] h-[500px]"
            }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b">
            <span className="text-sm font-medium text-gray-800">New Message</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-gray-200" onClick={doMinimize}>
                <GoDash className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-1 rounded hover:bg-gray-200" onClick={toggleMaximize}>
                <RxOpenInNewWindow className="w-4 h-4 text-gray-700" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 text-red-600"
                onClick={handleCloseAndLog}
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto">
            {/* To */}
            <div className="flex items-center gap-2">
              {maximized ? <label className="w-4 text-xs text-gray-600">To</label> : null}
              <div className="flex-1">
                <EmailInput value={toList} onChange={setToList} placeholder="recipient@example.com" />
              </div>

              {!showCC && (
                <button className="text-xs text-indigo-600 hover:underline" onClick={() => setShowCC(true)}>
                  Cc
                </button>
              )}
              {!showBCC && (
                <button className="ml-1 text-xs text-indigo-600 hover:underline" onClick={() => setShowBCC(true)}>
                  Bcc
                </button>
              )}
            </div>

            {showCC && (
              <div className="flex items-center gap-2">
                <label className="w-4 text-xs text-gray-600">CC</label>
                <div className="flex-1">
                  <EmailInput value={ccList} onChange={setCcList} placeholder="cc@example.com" />
                </div>
              </div>
            )}

            {showBCC && (
              <div className="flex items-center gap-2">
                <label className="w-4 text-xs text-gray-600">BCC</label>
                <div className="flex-1">
                  <EmailInput value={bccList} onChange={setBccList} placeholder="bcc@example.com" />
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center gap-2">
              {maximized ? <label className="w-4 text-xs text-gray-600">Sub</label> : null}
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 px-3 py-1 border-b text-sm focus:outline-none"
                placeholder="Subject"
              />
            </div>

            {/* Rich Text Editor */}
            <DraftRichPasteEditor
              maxLength={10000}
              placeholder="Compose your message..."
              className="w-full"
              sanitize={false}
              value={messageHtml}
              onChange={(html) => setMessageHtml(html)}
            />
          </div>

          {/* ATTACHED FILE SECTION (only for user-uploaded file; no preview) */}
          {attachedFile && (
            <div className="px-3 py-2 border-t bg-blue-50">
              <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 text-sm">
                <IoMdAttach className="text-gray-500" />
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-xs">{attachedFile.name}</span>
                  <span className="text-xs text-gray-500">{formatFileSize(attachedFile.size)}</span>
                </div>
                <button onClick={removeFile} className="text-red-500 hover:text-red-700 ml-2">
                  <IoMdClose size={14} />
                </button>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                disabled={toList.length === 0 || messageHtml.length === 0}
                className={`${toList.length === 0 || messageHtml.length === 0 ? "cursor-not-allowed opacity-50" : ""
                  } px-4 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700`}
                onClick={handleSend}
              >
                Send
              </button>

              {/* File Upload Button - Single file only */}
              <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer">
                <IoMdAttach />
                <input type="file" onChange={handleChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
