import React, { useState, useRef, useEffect } from "react";
import { GoDash } from "react-icons/go";
import { RxOpenInNewWindow } from "react-icons/rx";
import { IoMdClose, IoMdAttach } from "react-icons/io";
import { useClickContext } from "src/context/ClickContext";
import RichPasteEditor from "src/utils/RichPasteEditor";
import { encripttext, encriptfile } from "src/utils/encryptUtils";
import { decriptfile, decripttext } from "src/utils/decryptUtils";
import { decompressText } from "src/utils/deCompressUtils";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toast as toastify } from "react-toastify";
import { compressText } from "src/utils/compressUtils";
import Swal from "sweetalert2";
import SmallSpinner from "../loaders/SmallSpinner";
import { useNotify } from "src/context/NotifyContext";
import { FiChevronDown } from "react-icons/fi";
import SnackBar from "../snackbar/SnackBar";
import { useSnackbar } from "src/context/SnackbarContext";
function EmailInput({
  value = [],
  onChange,
  placeholder = "",
  suggestionList = [],
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestionList?.filter(
    (email) =>
      email.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(email),
  );

  const requestemail = (payload) =>
    axiosInstance.get(`/require/find-user?email=${payload.email}`);
  const { mutate: emailmutate } = useMutation({
    mutationFn: requestemail,
    mutationKey: ["checkemail"],
  });

  const flushToken = (raw) => {
    if (!raw) return;
    const token = raw.trim().replace(/,$/, "");
    if (!token) return;

    // avoid duplicate (case-insensitive)
    if (value.some((v) => v.toLowerCase() === token.toLowerCase())) {
      setInput("");
      return;
    }

    emailmutate(
      { email: token },
      {
        onSuccess: (emaildata) => {
          if (emaildata?.data?.message === "Success") {
            onChange([...value, token]);
          }
          setInput("");
        },
        onError: (emailerror) => {
          if (emailerror?.response?.data?.message === "Email Not Found") {
            toast.error("Email Not Found");
          }
          setInput("");
        },
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      flushToken(input);
    } else if (e.key === "Backspace" && input === "") {
      // delete last token
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
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setShowSuggestions(false)}
        onPaste={handlePaste}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] text-sm focus:outline-none px-1 py-1"
      />
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <ul className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {filteredSuggestions?.map((email, index) => {
              const firstLetter = email?.charAt(0).toUpperCase();

              return (
                <li
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    flushToken(email);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer 
                     hover:bg-indigo-50 transition-colors duration-150"
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F3EBFF] text-indigo-700 font-semibold text-sm">
                    {firstLetter}
                  </div>

                  {/* Email */}
                  <span className="text-sm text-slate-700 truncate">
                    {email}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function MailComposeUI() {
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  // const [visible, setVisible] = useState(true);

  const [messageHtml, setMessageHtml] = useState("");
  // const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // now simple arrays of strings
  const [toList, setToList] = useState([]);
  const [ccList, setCcList] = useState([]);
  const [bccList, setBccList] = useState([]);

  const [subject, setSubject] = useState("");
  const [passScheduleTimeToHandleSend, setPassScheduleTimeToHandleSend] =
    useState({});
  // const [sendInProgress, setSendInProgress] = useState(false);
  const { setSnackbar } = useSnackbar();

  const { close, isOpen, open } = useClickContext();
  const { setNotify } = useNotify();

  const DEFAULT_SCHEDULE_TIME = {
    today: "08:00",
    tomorrow: "08:00",
    custom: "08:00",
  };

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(DEFAULT_SCHEDULE_TIME);

  const [customDate, setCustomDate] = useState("");

  // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
      ? "Asia/Kolkata"
      : Intl.DateTimeFormat().resolvedOptions().timeZone;

  const toUTC = (date, time) => new Date(`${date}T${time}`).toISOString();

  const today = new Date().toISOString().split("T")[0];

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const schedule = (date, type) => {
    const time = scheduleTime[type] || "08:00";

    setPassScheduleTimeToHandleSend({
      type,
      send_at: toUTC(date, time),
      timezone,
    });

    // console.log({
    //   type,
    //   send_at: toUTC(date, time),
    //   timezone,
    // });
    setScheduleTime(DEFAULT_SCHEDULE_TIME);
    setCustomDate("");
    setScheduleOpen(false);
  };

  const queryClient = useQueryClient();

const { data: draftData } = useQuery({
  queryKey: ["compose-mail"],
  enabled: false, // read-only cache
});


useEffect(() => {
  if (!draftData) return;

  const restoreDraftMessage = async () => {
    try {
      let plainMessage = "";

      if (draftData.message?.ciphertext) {
        // 1️⃣ Decrypt
        const decrypted = await decripttext(draftData.message);

        // decrypted is COMPRESSED STRING
        // 2️⃣ Decompress
        plainMessage = await decompressText(decrypted);
      }

      // 3️⃣ Hydrate UI
      setToList(draftData.to || []);
      setCcList(draftData.cc || []);
      setBccList(draftData.bcc || []);
      setSubject(draftData.subject || "");
      setMessageHtml(plainMessage || "");

      if (draftData.file) {
        setAttachedFiles(
          Array.isArray(draftData.file)
            ? draftData.file
            : [draftData.file]
        );
      }
    } catch (err) {
      console.error("Failed to restore draft", err);
      toast.error("Failed to load draft message");
    }
  };

  restoreDraftMessage();
}, [draftData]);



const clearComposeCache = () => {
  queryClient.removeQueries({ queryKey: ["compose-mail"] });
};

  const datalist = () => axiosInstance.get("/require/suggest-mail");

  const { data: datalistResponse } = useQuery({
    queryKey: ["datalist"],
    queryFn: datalist,
  });
  const suggestionList = datalistResponse?.data?.data?.map(
    (suggestion) => suggestion.email_address,
  );

  const requestsendmail = (payload) =>
    axiosInstance.post("/require/send", payload);
  // const requestdraftmail = ({ payload, draft_id }) =>
  //   axiosInstance.post("/require/draft", payload);

  const requestdraftmail = ({ payload, draft_id }) => {
  if (draft_id) {
    // UPDATE existing draft
    return axiosInstance.put(
      `/require/draft/${draft_id}`,
      payload
    );
  }

  // CREATE new draft
  return axiosInstance.post(
    "/require/draft",
    payload
  );
};

  const {
    // data: sendmaildata,
    mutate: sendmailmutate,
    isPending: isSending,
    // error: sendmailerror,
  } = useMutation({
    mutationFn: requestsendmail,
    mutationKey: ["sendmail"],
    onSuccess: () => {
        clearComposeCache();
      setSnackbar(null);
      toast.success("Email Sent Successfully");
      // setSendInProgress(false);
      resetAllFields();
      close?.();
    },
    onError: () => {
      setSnackbar(null); //  hide snackbar
      open();
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
    },
  });

  const {
    data: draftmaildata,
    mutate: draftMailMutate,
    error: draftmailerror,
  } = useMutation({
    mutationFn: requestdraftmail,
    mutationKey: ["draftmail"],
  });

  useEffect(() => {
    if (draftmaildata || draftmailerror) {
      if (draftmaildata) {
        const msg = draftmaildata?.data?.message;

        if (msg === "Success") {
          toast.success("Message Saved to Draft");
        }
      }
    }
  }, [draftmaildata, draftmailerror]);
  const resetAllFields = () => {
    setToList([]);
    setCcList([]);
    setBccList([]);
    setSubject("");
    setMessageHtml("");
    setAttachedFiles([]);
  };

  //run when unmount
  // useEffect(() => {
  //   return () => {
  //     if (!mailSent) {
  //       autoSaveDraft();
  //     }
  //   };
  // }, [mailSent]);

  // if (!visible) return null;
  if (!isOpen) return null;

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

 

  const handleClose = async () => {
  // build payload
  const payload = await buildPayload();

  const hasContent =
    toList.length > 0 ||
    subject.trim().length > 0 ||
    messageHtml.trim().length > 0 ||
    attachedFiles.length > 0;

  // save draft only if something exists
  if (hasContent) {
    draftMailMutate({payload, draft_id: draftData?.draft_id});
  }

  // 🧹 clear compose draft cache (VERY IMPORTANT)
  queryClient.removeQueries({ queryKey: ["compose-mail"] });

  // close compose window
  close?.();
};

  // const handleChange = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const MAX_SIZE = 3 * 1024 * 1024;
  //   if (file.size > MAX_SIZE) {
  //     toastify.error(
  //       `File "${file.name}" exceeds 3 MB. Please upload a smaller file.`,
  //     );

  //     e.target.value = "";
  //     return;
  //   }
  //   setAttachedFile({
  //     id: Date.now(),
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     file: file,
  //   });
  //   e.target.value = "";
  // };
 const handleChange = (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const MAX_TOTAL_SIZE = 3 * 1024 * 1024; // 3 MB

  const currentTotalSize = attachedFiles.reduce(
    (sum, f) => sum + f.size,
    0
  );

  const newFilesSize = files.reduce(
    (sum, f) => sum + f.size,
    0
  );

  //  HARD STOP — do NOT add anything
  if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE) {
    toastify.error(
      "Total attachment size exceeds 3 MB. Please upload smaller files."
    );
    e.target.value = "";
    return;
  }

  //  Safe to add all files
  const mappedFiles = files.map((file) => ({
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }));

  setAttachedFiles((prev) => [...prev, ...mappedFiles]);

  e.target.value = "";
};
  const removeFile = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  console.log('draft id check', draftData?.draft_id);
  
  const buildPayload = async () => {
    let encryptedFile = null;
    let encryptedText = null;

    // 🔐 Encrypt ALL attached files
    if (attachedFiles?.length > 0) {
      encryptedFile = await encriptfile(attachedFiles);
    }

    if (messageHtml) {
      const compress = await compressText(messageHtml);
      encryptedText = await encripttext(compress);
    }

    return {
          // draft_id: draftData?.draft_id || null, 
      to: toList.length ? toList : null,
      cc: ccList.length ? ccList : null,
      bcc: bccList.length ? bccList : null,
      subject: subject || null,
      message: encryptedText || null,
      file: encryptedFile || null,
      send_at: passScheduleTimeToHandleSend?.send_at || null,
      timezone: passScheduleTimeToHandleSend?.timezone || null,
      type: passScheduleTimeToHandleSend?.type || null,
    };
  };

  const handleSend = async () => {
    // setSendInProgress(true);
    const payload = await buildPayload();
    setSnackbar(<SnackBar text="Sending email…" />);

    try {
      sendmailmutate(payload);
      close?.();
      setNotify("mailbox-submited");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email: " + error.message);
    }
  };

  const handleSaveDraft = async () => {
    const payload = await buildPayload();
    draftMailMutate({payload, draft_id: draftData?.draft_id});
    if (typeof close === "function") close();
    // setVisible(false);
    close?.();
  };



  return (
    <div
      className={`fixed z-[1200] transition-all duration-200 ${
        maximized ? "inset-0 flex justify-center items-start pt-20" : ""
      } ${!maximized ? "right-6 bottom-6" : ""}`}
    >
      {minimized && !maximized && (
        <div
          className="w-60 bg-white shadow-xl border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
          onClick={doRestoreFromMinimized}
        >
          <span className="text-sm font-medium">New Message</span>
          <IoMdClose
            className="text-red-500 hover:bg-[#c49dff] rounded p-1 cursor-pointer"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        </div>
      )}

      {!minimized && (
        <div
          className={`bg-white shadow-xl border rounded-lg flex flex-col overflow-hidden transition-all duration-200 ${
            maximized ? "w-[90%] h-[80vh]" : "w-[500px] h-[500px]"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#F3EBFF] border-b">
            <span className="text-sm font-medium text-gray-800">
              New Message
            </span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-gray-200"
                onClick={doMinimize}
              >
                <GoDash className="w-4 h-4 text-gray-700" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200"
                onClick={toggleMaximize}
              >
                <RxOpenInNewWindow className="w-4 h-4 text-gray-700" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-200 text-red-600"
                onClick={handleClose}
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* To */}
            <div className="flex items-center gap-2 px-2">
              {maximized ? (
                <label className="w-4 text-xs text-gray-600">To:</label>
              ) : null}
              <div className="flex-1">
                <EmailInput
                  value={toList}
                  suggestionList={suggestionList}
                  onChange={setToList}
                  placeholder="recipient@kyberra.com"
                />
              </div>

              {!showCC && (
                <button
                  className="text-xs text-[#8A3FFA] hover:underline"
                  onClick={() => setShowCC(true)}
                >
                  Cc
                </button>
              )}
              {!showBCC && (
                <button
                  className="ml-1 text-xs text-[#8A3FFA] hover:underline"
                  onClick={() => setShowBCC(true)}
                >
                  Bcc
                </button>
              )}
            </div>

            {showCC && (
              <div className="flex items-center gap-2 px-2">
                <label className="w-4 text-xs text-gray-600">CC:</label>
                <div className="flex-1">
                  <EmailInput
                    value={ccList}
                    suggestionList={suggestionList}
                    onChange={setCcList}
                    placeholder="cc@kyberra.com"
                  />
                </div>
              </div>
            )}

            {showBCC && (
              <div className="flex items-center gap-2 px-2">
                <label className="w-4 text-xs text-gray-600">BCC:</label>
                <div className="flex-1">
                  <EmailInput
                    value={bccList}
                    suggestionList={suggestionList}
                    onChange={setBccList}
                    placeholder="bcc@kyberra.com"
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center gap-2 px-2">
              {maximized ? (
                <label className="w-4 text-xs text-gray-600">Sub:</label>
              ) : null}
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 px-3 py-1.5 border-b text-sm focus:outline-none"
                placeholder="Subject"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 min-h-0">
              <RichPasteEditor
                key={draftData?.draft_id || "new"}
                value={messageHtml}          // ✅ THIS IS REQUIRED
                maxLength={25000}
                placeholder="Compose your message..."
                className="w-full"
                sanitize={false}
                onChange={(html) => setMessageHtml(html)}
              />
            </div>
          </div>

          {/* ATTACHED FILES – CHIP STYLE */}
          {attachedFiles.length > 0 && (
            <div className="px-3 py-2   min-h-[44px]
      max-h-[96px]
      overflow-y-auto
      scrollbar-thin
      scrollbar-thumb-gray-300
      scrollbar-track-transparent ">
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 max-w-full 
                     bg-white border border-[#eaf0f8] rounded-full px-3 py-1 
                     text-xs shadow-sm"
                  >
                    <IoMdAttach className="text-gray-500 text-sm shrink-0" />

                    <span className="truncate max-w-[70px] font-medium text-gray-800">
                      {file.name}
                    </span>

                    <span className="text-gray-500">
                      {formatFileSize(file.size)}
                    </span>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="ml-1 text-gray-400 hover:text-red-500 transition"
                    >
                      <IoMdClose size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              {/* <button
                disabled={
                  isSending || toList.length === 0 || messageHtml.length === 0
                }
                className={` ${
                  isSending || toList.length === 0 || messageHtml.length === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                } px-4 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700`}
                onClick={handleSend}
              >
                {isSending ? <SmallSpinner /> : "Send"}
              </button> */}
              <div className="relative inline-flex">
                <button
                  disabled={
                    isSending || toList.length === 0 || messageHtml.length === 0
                  }
                  className={`${isSending || toList.length === 0 || messageHtml.length === 0 ? "cursor-not-allowed opacity-50" : ""} bg-[#8A3FFA] hover:bg-[#7f2dfa] text-white px-5 py-2 rounded-l-full text-sm font-medium`}
                  onClick={handleSend}
                >
                  {" "}
                  {isSending ? <SmallSpinner /> : "Send"}{" "}
                </button>

                {/* ARROW */}
                <button
                  onClick={() => setScheduleOpen(!scheduleOpen)}
                  disabled={
                    isSending || toList.length === 0 || messageHtml.length === 0
                  }
                  className={`${isSending || toList.length === 0 || messageHtml.length === 0 ? "cursor-not-allowed opacity-50" : ""} bg-[#8A3FFA] hover:bg-[#7f2dfa] text-white px-3 rounded-r-full border-l border-[#F6F0FF]`}
                >
                  <FiChevronDown />
                </button>

                {/* DROPDOWN */}
                {scheduleOpen && (
                  <div className="absolute -right-64 bottom-full mb-2 w-72 bg-white rounded-lg shadow-xl border z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-sm">Schedule send</p>
                      <p className="text-xs text-gray-500">
                        When do you want your message to be sent?
                      </p>
                    </div>

                    {/* TODAY */}
                    <div
                      className="px-4 py-3 hover:bg-gray-100 flex justify-between cursor-pointer"
                      onClick={() => schedule(today, "today")}
                    >
                      <span>Today</span>
                      <input
                        type="time"
                        value={scheduleTime.today}
                        onChange={(e) =>
                          setScheduleTime((prev) => ({
                            ...prev,
                            today: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm border rounded px-1"
                      />
                    </div>

                    {/* TOMORROW */}
                    <div
                      className="px-4 py-3 hover:bg-gray-100 flex justify-between cursor-pointer"
                      onClick={() => schedule(getTomorrow(), "tomorrow")}
                    >
                      <span>Tomorrow</span>
                      <input
                        type="time"
                        value={scheduleTime.tomorrow}
                        onChange={(e) =>
                          setScheduleTime((prev) => ({
                            ...prev,
                            tomorrow: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm border rounded px-1"
                      />
                    </div>

                    {/* CUSTOM */}
                    <div className="px-4 py-3 border-t space-y-2">
                      <span className="font-medium text-sm">Custom</span>

                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          min={today} //  disable previous dates
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-32 border rounded px-2 py-1 text-sm"
                        />

                        <input
                          type="time"
                          value={scheduleTime.custom}
                          onChange={(e) =>
                            setScheduleTime((prev) => ({
                              ...prev,
                              custom: e.target.value,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-[118px] border rounded px-2 py-1 text-sm"
                        />
                      </div>

                      <button
                        disabled={!customDate}
                        onClick={() => schedule(customDate, "custom")}
                        className="w-full bg-[#8A3FFA] text-white rounded py-1 text-sm disabled:opacity-50"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Button - Single file only */}
              <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer">
                <IoMdAttach />
                <input
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleSaveDraft}
              className="text-sm text-gray-600 hover:underline"
            >
              Save as Draft
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
