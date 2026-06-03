// src/components/GmailLikeInbox.jsx
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiSearch, FiTrash2 } from "react-icons/fi";

import PasskeyModal from "src/components/popups/PasskeyModal";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatMailTimestamp } from "src/utils/formateDateAndTimeUtils";
import toast from "react-hot-toast";
import Skeleton from "src/components/loaders/Skeliton";
import NoDataFound from "src/components/nodata/NoData";
// import DraftMailbox from "src/components/mailbox/draft/DraftMailbox";
import Swal from "sweetalert2";
import { useClickContext } from "src/context/ClickContext";
import { useQueryClient } from "@tanstack/react-query";

const Draft = () => {
  const [selectedIds, setSelectedIds] = useState([]); // emailId[]
  const [search, setSearch] = useState("");
  const [passkeyError, setPasskeyError] = useState(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [selectedDraftIdForPasskey, setSelectedDraftIdForPasskey] = useState(null);
  const [page, setPage] = useState(1);
  const [noArchivedEmails, setNoArchivedEmails] = useState(false);

  // server passkey response -> DraftMailbox
  const [draftResponse, setDraftResponse] = useState(null);
  const [draftOpenKey, setDraftOpenKey] = useState(null);
  const queryClient = useQueryClient();

  // local uploaded file override for drafts
  const [localUploadFile, setLocalUploadFile] = useState(null);
  const [deleteOverrides, setDeleteOverrides] = useState(new Set());
  

  const user = localStorage.getItem("userDetails");
  const userDetails = user ? JSON.parse(user) : {};
  const userId = userDetails.id;

    const { close, isOpen, open } = useClickContext();



 
  const passkeyRequest = (payload) =>
    axiosInstance.get(
      `/require/message?draft_id=${payload.draft_id}&passkey=${payload.passkey}&senderId=${userId}`);

      const draftActionRequest = (payload) => axiosInstance.post('/require/action', payload);

  const {
    data: isResponse,
    mutate: isMutate,
    error: isError,
    isPending: isLoading,
  } = useMutation({
    mutationFn: passkeyRequest,
    mutationKey: ["draftpasskey"],
  });

  const fetchDraft = async ({ queryKey }) => {
    const [, p] = queryKey;
    return axiosInstance.get(`/require/draft-list/${p}`);
  };

  const { data: sentMails, refetch: sentRefetch, isPending: sentLoading, error: sentError } =
    useQuery({
      queryKey: ["draft", page],
      queryFn: fetchDraft,
    });

     const { mutate: draftActionMutate, data: draftActionResponse ,error: draftActionError} = useMutation({
      mutationFn: draftActionRequest,
      mutationKey: ["draftpageaction"],
    });

    useEffect(() => {
    if (draftActionResponse || draftActionError){

      if(draftActionResponse?.data?.message === "Add To deleted Successfully "){
        toast.success("Draft Deleted Successfully");
        sentRefetch();
      }

      if(draftActionError?.response?.data?.message === "Draft Not Found"){
        toast.error("Draft Not Found");
      }else if(draftActionError?.response?.data?.message === "Internal Server Error"){
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
    
   
    }, [ draftActionResponse, draftActionError]);

  useEffect(() => {
    if (sentError) {
      const msg = sentError?.response?.data?.message;
      if (msg === "No Archived Emails Found") {
        setNoArchivedEmails(true);
      }
    }
  }, [sentError]);

  const mailsFromApi = sentMails?.data?.data || [];

  // filter
  const mails = mailsFromApi.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.subject?.toLowerCase().includes(q) ||
      m.messagePreview?.toLowerCase().includes(q) ||
      m.to?.some(
        (recipient) =>
          recipient.email.toLowerCase().includes(q) ||
          recipient.name?.toLowerCase().includes(q)
      )
    );
  });
    // UI state filter (archive/delete instant)
const visibleMails = mails.filter(
  (mail) => !deleteOverrides.has(mail.draft_id)
);

  // select
  const toggleSelect = (draftId) => {
    setSelectedIds((prev) => {
      if (prev.includes(draftId)) return prev.filter((x) => x !== draftId);
      return [...prev, draftId];
    });
  };

  const selectAll = () => {
    if (mails.length === 0) return;
    setSelectedIds((prev) => (prev.length === mails.length ? [] : mails.map((m) => m.draft_id)));
  };

  // open passkey modal
  const handleMailClick = (draftId) => {
    setSelectedDraftIdForPasskey(draftId)
    // setSelectedMailIdForPasskey(mailId);
    // setSelectedSenderIdForPasskey(senderId);
    // setSelectedReceiverIdForPasskey(receiverId);
    setShowPasskeyModal(true);
    setPasskeyError(null);
  };

  const handlePasskeySubmit = (passkey) => {
    isMutate({
      draft_id: selectedDraftIdForPasskey,
      passkey,
    });
  };

  // when passkey response arrives -> load DraftMailbox
  useEffect(() => {
    if (isResponse || isError) {
      if (isResponse?.data?.message === "Success") {
            const draftData = isResponse.data?.data;

    // 1️⃣ Put draft into React Query cache
    queryClient.setQueryData(["compose-mail"], {
      draft_id: draftData?.draft_id,
      to: draftData?.to || [],
      cc: draftData?.cc || [],
      bcc: draftData?.bcc || [],
      subject: draftData?.subject || "",
      message: draftData?.message || "",
      file: draftData?.file || null,
      mode: "draft", // optional flag
    });

        open();
        setDraftResponse(isResponse.data);
        setDraftOpenKey(Date.now());
        setShowPasskeyModal(false);
        setPasskeyError(null);
        toast.success("Passkey accepted — loaded message into Draft panel.");
      }

      if (isError?.response?.data?.message === "Invalid Passkey") {
        setPasskeyError("Invalid Passkey");
      } else if (isError) {
        setPasskeyError("Passkey validation failed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResponse, isError]);

  const allSelected = mails.length > 0 && selectedIds.length === mails.length;

  // Only delete action (POST) — single email or many
  const deleteAction = ({ draftIds }) => {

   //  instant UI (handle array properly)
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    draftIds.forEach((id) => next.add(id));
    return next;
  });

    const payload = {
      draft_id: draftIds,
      action_type: "deleted",
      sender_id: userId
    };
    draftActionMutate(payload);
    // console.log('payload action', payload);
 
  };

  useEffect(() => {
  setDeleteOverrides(new Set());
}, [sentMails]);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
           //  instant UI update
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    selectedIds.forEach((id) => next.add(id));
    return next;
  });
   // selectedIds already contains draft_id[]
  deleteAction({ draftIds: selectedIds });
  setSelectedIds([]); // clear selection
  };

  // Attach local file override for drafts (kept)
  const attachLocalFile = (file) => {
    if (!file) return;
    setLocalUploadFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  // buildDraftPayload merges server response + local file info
  const buildDraftPayload = (extra = {}) => {
    const base = draftResponse?.data ? { ...draftResponse.data } : {};

    let filePayload = null;
    if (localUploadFile) {
      filePayload = {
        filename: localUploadFile.name,
        mimeType: localUploadFile.type,
        size: localUploadFile.size,
      };
    } else if (base.file) {
      filePayload = base.file;
    }

    const payload = {
      subject: base.subject ?? null,
      message: base.message ?? null,
      to: base.to ?? null,
      cc: base.cc ?? null,
      bcc: base.bcc ?? null,
      file: filePayload,
      ...extra,
    };

    return payload;
  };

  // SEND DRAFT -> console-only (no API call)
  const sendDraft = async (overrides = {}) => {
    const payloadMeta = buildDraftPayload(overrides);

    if (localUploadFile) {
      payloadMeta.file = {
        filename: localUploadFile.name,
        mimeType: localUploadFile.type,
        size: localUploadFile.size,
      };
    }

    if (draftResponse?.data?.draft_id) {
      payloadMeta.draft_id = draftResponse.data.draft_id;
    }

    // console.log("Draft payload (no API call):", payloadMeta);
    return Promise.resolve(payloadMeta);
  };

  // close draft -> clear UI and console "saved" draft payload
  const closeDraftApi = async () => {
    // Clear UI
    setDraftResponse(null);
    setLocalUploadFile(null);
    setSelectedDraftIdForPasskey(null);
    // setSelectedSenderIdForPasskey(null);
    // setSelectedReceiverIdForPasskey(null);

    // "Save" in background by logging
    sendDraft().catch(() => {
      // silent
    });
  };

  const handleRefresh = () => {
    sentRefetch();
  };

  return (
    <div className="bg-white w-full relative">
      {/* {draftResponse !== null ? (
        <DraftMailbox
          key={draftOpenKey ?? "draft-mailbox"}
          response={draftResponse}
          localUploadFile={localUploadFile}
          onAttachFile={attachLocalFile}
          onSendDraft={sendDraft}
          onCloseDraft={closeDraftApi}
          onDraftSend={() => sentRefetch()}
        />
      ) : null} */}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-[13px] h-[13px] accent-[#8A3FFA] cursor-pointer"
              onChange={selectAll}
              checked={allSelected}
            />
          </label>

          <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-[#F3EBFF] transition">
            <FiRefreshCw />
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds?.length === 0}
            className={`p-2 rounded-full hover:bg-[#F3EBFF] transition ${selectedIds?.length === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-[#F3EBFF] border rounded-full px-3 py-1 gap-2">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mail"
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              className={`p-2 rounded hover:bg-#F3EBFF transition ${page === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft />
            </button>

            <button
              className={`p-2 rounded hover:bg-[#F3EBFF] transition ${mails?.length < 50 ? "cursor-not-allowed opacity-50" : ""
                }`}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={mails?.length < 50}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Mail List */}
      {sentLoading ? (
        <Skeleton />
      ) : mails?.length === 0 || noArchivedEmails ? (
        <NoDataFound title="No Draft Emails Found" subtitle="You don't have any draft messages." className="h-[calc(100vh-110px)] overflow-hidden" />
      ) : (
        <div className="overflow-auto">
          <ul className="divide-y h-[calc(100vh-110px)]">
            {visibleMails.map((mail) => {
              const mailId = mail?.emailId;
              // const receiverId = mail?.receiver_id;
              // const senderId = mail?.sender_id;
              const draftId = mail?.draft_id;
              const isSelected = selectedIds.includes(draftId);

              return (
                <li
                  key={mailId}
                  className={`${mail?.is_read === false ? "bg-[#eaf0f8]" : ""} group grid grid-cols-[20px_200px_1fr_auto] items-center gap-4 px-4 py-2 hover:bg-[#F3EBFF] transition cursor-pointer`}
                  onClick={() => handleMailClick( draftId)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <input checked={isSelected} onChange={() => toggleSelect(draftId)} type="checkbox" className="w-[13px] h-[13px] accent-[#8A3FFA] cursor-pointer" />
                  </div>

                  <div className="font-medium text-sm truncate text-red-500">
                    (Draft)
                    {/* {mail?.from?.first_name || (mail?.to?.length ? mail.to.map((t) => t.first_name).join(", ") : null) || "(No Sender)"} */}
                  </div>

                  <div className="min-w-0 flex items-center gap-3 truncate">
                    <div className="font-semibold text-xs truncate">
                      {mail?.subject || "(No Subject)"}
                    </div>

                    <span className="text-gray-400 flex-shrink-0">-</span>

                    <div className="text-xs text-gray-500 truncate hidden sm:block min-w-0">
                      {mail?.messagePreview || "(No Preview)"}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-right">
                    <span className="group-hover:hidden text-xs">{formatMailTimestamp(mail?.created_at) || "Now"}</span>

                    <div className="hidden group-hover:flex items-center justify-end gap-2">
                      <button
                        className="p-1 rounded-full hover:bg-[#cfafff]"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAction({ draftIds: [draftId] });
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Passkey Modal */}
      <PasskeyModal open={showPasskeyModal} passkeyError={passkeyError} isLoading={isLoading} onClose={() => setShowPasskeyModal(false)} onSubmit={handlePasskeySubmit} />
    </div>
  );
};

export default Draft;
