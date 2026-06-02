import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiArchive,
  FiAlertCircle,
  FiTrash2,
  FiMoreVertical,
  FiChevronDown,
} from "react-icons/fi";
import { decriptfile, decripttext } from "src/utils/decryptUtils";
import { formatMailTimestamp } from "src/utils/formateDateAndTimeUtils";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "src/api/Api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { decompressText } from "src/utils/deCompressUtils";
import { HiOutlineDownload} from 'react-icons/hi';

const SendDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [decryptedHtml, setDecryptedHtml] = useState("");
  const [decryptedFile, setDecryptedFile] = useState(null);
  const { response } = location.state || {};
  //   console.log("SendDetails  response:", response);

  const actionRequest = (payload) =>
    axiosInstance?.post("/require/action", payload);

  const {
    data: actionData,
    mutate: actionMutate,
    error: actionError,
  } = useMutation({
    queryKey: ["sent"],
    mutationFn: actionRequest,
  });

  const handleAction = (type) => {
    let payload;

    if (response?.data?.receiverId) {
      payload = {
        email_id: [response?.data?.emailId],
        // sender_id: response?.data?.senderId,
        receiver_id: response?.data?.receiverId,
        action_type: type,
      };
    } else if (response?.data?.senderId) {
      payload = {
        email_id: [response?.data?.emailId],
        sender_id: response?.data?.senderId,
        // receiver_id: response?.data?.receiverId,
        action_type: type,
      };
    }else{
      console.warn("⚠ No senderId or receiverId provided!");
      return;
    }
    actionMutate(payload);
  };

  useEffect(() => {
    if (actionData || actionError) {
      if (actionData?.data?.message === "Add To favorite Successfully ") {
        toast.success("Message Starred Successfully");
      } else if (
        actionData?.data?.message === "Add To archived Successfully "
      ) {
        toast.success("Message Archived Successfully. move to inbox");
        setTimeout(() => {
          navigate(-1);
        }, 500);
      } else if (actionData?.data?.message === "Add To deleted Successfully ") {
        toast.success("Message Deleted Successfully move to inbox");
        setTimeout(() => {
          navigate(-1);
        }, 500);
      } else {
        console.log("no action error for send page");
      }
    }

    if (actionError) {
      const msg = actionError?.response?.data?.message;

      if (msg === "Internal Server Error") {
          Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "We encountered an unexpected system issue while processing your request. Our technical team has been notified. Please try again in a few moments.",
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: "Understood",
        confirmButtonColor: "#6C72F3",
        backdrop: true,
      }).then(() => {
          navigate(-1);
        });
      }
    }
  }, [actionData, actionError]);


   const linkifyHtmlForView = (html) => {
  if (!html) return "";

  const container = document.createElement("div");
  container.innerHTML = html;

  const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/gi;

  const walk = (node) => {
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

  useEffect(() => {
    const runDecrypt = async () => {
      try {
        if (response?.data?.message) {
          const text = await decripttext(response.data.message);
          const html = await decompressText(text);
          setDecryptedHtml(linkifyHtmlForView(html || ""));
        } else {
          setDecryptedHtml("");
        }

        // 📎 Decrypt File
        if (response?.data?.file) {
          const fileOutput = await decriptfile(response.data.file);

          setDecryptedFile(fileOutput);
        } else {
          setDecryptedFile(null);
        }
      } catch (err) {
        console.error("Decrypt error:", err);
        setDecryptedHtml("");
        setDecryptedFile(null);
      }
    };

    runDecrypt();
  }, [response]); //  triggered once when response is available
  // State for decrypted content

  // derive initials from first "to" email directly
  const firstTo = response?.data?.to?.[0] || "";
  const initials = firstTo
    ? (firstTo.split("@")[0]?.[0] || "M").toUpperCase()
    : "M";

  // Popover state & refs
  const [showSenderInfo, setShowSenderInfo] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const senderBtnRef = useRef(null);
  const popoverRef = useRef(null);

  const openSenderPopover = () => {
    const btn = senderBtnRef.current;
    if (!btn) {
      setShowSenderInfo(true);
      return;
    }
    const rect = btn.getBoundingClientRect();
    const padding = 8;
    const popoverWidth = 340;
    let left = rect.left;
    const viewportWidth = window.innerWidth;
    if (left + popoverWidth + 16 > viewportWidth) {
      left = Math.max(12, viewportWidth - popoverWidth - 12);
    }
    const top = rect.bottom + padding;
    setPopoverPos({ top, left });
    setShowSenderInfo(true);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowSenderInfo(false);
    };
    const onClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        senderBtnRef.current &&
        !senderBtnRef.current.contains(e.target)
      ) {
        setShowSenderInfo(false);
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  
  const downloadFile = (file) => {
  const a = document.createElement("a");
  a.href = file.url;
  a.download = file.meta?.filename || "attachment";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
const downloadAllFiles = () => {
  decryptedFile.forEach(downloadFile);
};



const getFileBadge = (mimeType) => {
  if (!mimeType) return { label: "FILE", color: "bg-gray-400" };

  if (mimeType.includes("pdf")) return { label: "PDF", color: "bg-red-500" };
  if (mimeType.includes("excel") || mimeType.includes("sheet"))
    return { label: "XLS", color: "bg-green-600" };
  if (mimeType.includes("word"))
    return { label: "DOC", color: "bg-blue-600" };
  if (mimeType.includes("image"))
    return { label: "IMG", color: "bg-purple-500" };

  return { label: "FILE", color: "bg-gray-400" };
};


  return (
    <div className="h-[calc(100vh-65px)] bg-gray-50">
      {/* Top action toolbar */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Back to inbox"
            >
              <FiChevronLeft className="text-lg" />
            </button>

            <div className="hidden sm:flex items-center gap-1">
              <button
                className="p-2 rounded hover:bg-gray-100 transition"
                title="Archive"
                onClick={() => handleAction("archived")}
              >
                <FiArchive />
              </button>
              <button
                className="p-2 rounded hover:bg-gray-100 transition"
                title="Report spam"
              >
                <FiAlertCircle />
              </button>
              <button
                className="p-2 rounded hover:bg-gray-100 transition"
                title="Delete"
                onClick={() => handleAction("deleted")}
              >
                <FiTrash2 />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              <button
                className="p-2 rounded hover:bg-gray-100 transition"
                title="More"
              >
                <FiMoreVertical />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-gray-100 transition"
              title="More"
            >
              <FiMoreVertical />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-3 py-3 h-[calc(100vh-105px)] overflow-y-scroll">
        {/* Subject area */}
        <div className="bg-white rounded-t-md px-5 py-6 shadow-sm border border-b-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex flex-col">
              <h1
                className="
    text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight
    truncate min-w-[160px] max-w-[700px]
  "
                title={response?.data?.subject || "No subject"}
              >
                {response?.data?.subject || "No subject"}
              </h1>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#676ce7] text-white flex items-center justify-center font-semibold">
                    {initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {response?.data?.from?.first_name || "No sender"}
                      </span>

                      {response?.data?.from?.email && (
                        <span className="text-xs text-gray-500">
                          &lt;{response.data.from.email}&gt;
                        </span>
                      )}

                      <button
                        ref={senderBtnRef}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showSenderInfo) setShowSenderInfo(false);
                          else openSenderPopover();
                        }}
                        aria-label="Show sender details"
                        title="Show sender details"
                      >
                        <FiChevronDown />
                      </button>
                    </div>

                    <div
                      className="text-xs text-gray-500 mt-1 truncate min-w-[120px] max-w-[300px] overflow-hidden"
                      title={response?.data?.to?.join(", ") || "recipient"}
                    >
                      to {response?.data?.to?.join(", ") || "recipient"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">
                {formatMailTimestamp(response?.data?.created_at) || ""}
              </span>
              {/* <button
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title="Star"
                onClick={() => handleAction("favorite")}
              >
                <FiStar
                  className={`${
                    response?.data?.favorite === true
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
              </button> */}
            </div>
          </div>
        </div>

        {/* Sender info popover */}
        {showSenderInfo && (
          <div
            ref={popoverRef}
            className="fixed z-50"
            style={{
              top: popoverPos.top,
              left: popoverPos.left,
              width: 340,
            }}
          >
            <div className="mt-2 w-full bg-white border rounded shadow-lg p-4 text-sm text-gray-700">
              <div className="grid grid-cols-[90px_1fr] gap-2">
                <div className="text-gray-500">from:</div>
                <div className="font-medium">
                  {response?.data?.from?.email && (
                    <span className="text-xs text-gray-500">
                      &lt;{response.data.from.email}&gt;
                    </span>
                  )}
                </div>

                <div className="text-gray-500">to:</div>
                <div className="text-xs">
                  {response?.data?.to?.join(", ") || "No recipient"}
                </div>

                <div className="text-gray-500">cc:</div>
                <div className="text-xs">
                  {response?.data?.cc?.join(", ") || "No recipient"}
                </div>

                <div className="text-gray-500">bcc:</div>
                <div className="text-xs">
                  {response?.data?.bcc?.join(", ") || "No recipient"}
                </div>

                <div className="text-gray-500">date:</div>
                <div>
                  {formatMailTimestamp(response?.data?.created_at) || "-"}
                </div>

                <div className="text-gray-500">subject:</div>
                <div>{response?.data?.subject || "No subject"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Message card */}
        <div className="bg-white border rounded-b-md shadow-sm mt-2 px-6 py-6 overflow-auto">
          <div className="prose max-w-none text-sm sm:text-base text-gray-800 whitespace-pre-wrap">
            <div
              className="prose max-w-none text-sm sm:text-base text-gray-800"
              dangerouslySetInnerHTML={{
                __html: decryptedHtml || "No message content",
              }}
            />
               
   {decryptedFile?.length > 0 && (
     <div className="mt-6 border-t pt-4">
       {/* Header */}
       <div className="flex items-center justify-between mb-3">
         <span className="text-sm text-gray-600 font-medium">
           {decryptedFile.length} attachment
           {decryptedFile.length > 1 ? "s" : ""}
         </span>
   
         <button
           onClick={downloadAllFiles}
           className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
         >
           <HiOutlineDownload className="w-4 h-4" />
           Download all
         </button>
       </div>
   
       {/* Files */}
       <div className="flex gap-3 flex-wrap">
         {decryptedFile.map((file, index) => {
           const badge = getFileBadge(file.meta?.mimeType);
           const isImage = file.meta?.mimeType?.startsWith("image/");
   
           return (
             <div
               key={index}
               className="w-[180px] border rounded-md bg-white hover:shadow-sm transition"
             >
               {/* Preview */}
               <div className="h-24 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                 {isImage ? (
                   <img
                     src={file.url}
                     alt={file.meta?.filename}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <span className="text-gray-400 text-sm">
                     {file.meta?.filename
                       ?.split(".")
                       .pop()
                       ?.toUpperCase()}
                   </span>
                 )}
   
                 <span
                   className={`absolute bottom-2 right-2 text-xs text-white px-2 py-0.5 rounded ${badge.color}`}
                 >
                   {badge.label}
                 </span>
               </div>
   
               {/* Info */}
               <div className="px-3 py-2">
                 <p
                   className="text-sm truncate"
                   title={file.meta?.filename}
                 >
                   {file.meta?.filename}
                 </p>
   
                 <div className="flex items-center justify-between mt-2">
                   <span className="text-xs text-gray-500">
                     {(file.blob?.size / 1024).toFixed(0)} KB
                   </span>
   
                   <button
                     onClick={() => downloadFile(file)}
                     className="text-blue-600 hover:underline"
                   >
                     <HiOutlineDownload className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   )}
   
          </div>

          {/* Footer actions */}
          {/* <div className="mt-6 border-t pt-4 flex flex-wrap gap-2">
            <button className="px-3 py-2 rounded border text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2">
              <FiCornerUpLeft />
              <span>Reply</span>
            </button>

            <button className="px-3 py-2 rounded border text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2">
              <FiCornerUpRight />
              <span>Forward</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SendDetails;
