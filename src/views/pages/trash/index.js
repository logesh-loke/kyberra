// GmailLikeInbox.jsx
import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";


import PasskeyModal from "src/components/popups/PasskeyModal";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatMailTimestamp } from "src/utils/formateDateAndTimeUtils";
import toast from "react-hot-toast";
import Skeleton from "src/components/loaders/Skeliton";
import NoDataFound from "src/components/nodata/NoData";


const ConfirmModal = ({ open, title, description, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-[#F3EBFF]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Trash = () => {
  const [selectedIds, setSelectedIds] = useState([]); // emailId[]
  const [search, setSearch] = useState("");
  const [passkeyError, setPasskeyError] = useState(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [selectedMailIdForPasskey, setSelectedMailIdForPasskey] =
    useState(null);
  const [selectedSenderIdForPasskey, setSelectedSenderIdForPasskey] =
    useState(null);
  const [selectedReceiverIdForPasskey, setSelectedReceiverIdForPasskey] =
    useState(null);
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState(null); // { mode: 'single' | 'bulk', emailId?, receiverId?, senderId? }
const [noDeletedEmails, setNoDeletedEmails] = useState(false);
const [deleteOverrides, setDeleteOverrides] = useState(new Set());
const [restoreOverrides, setRestoreOverrides] = useState(new Set());

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const passkeyRequest = (payload) =>
    axiosInstance.get(
      `/require/message?emailId=${payload.email_id}&passkey=${payload.passkey}${
        payload.sender_id ? `&senderId=${payload.sender_id}` : ""
      }${payload.receiver_id ? `&receiverId=${payload.receiver_id}` : ""}`
    );

  const {
    data: isResponse,
    mutate: isMutate,
    error: isError,
    isPending: isLoading,
  } = useMutation({
    mutationFn: passkeyRequest,
    mutationKey: ["trashpasskey"],
  });

  const sendRequest = async ({ queryKey }) => {
    const [, page] = queryKey;
    return axiosInstance.get(`/require/deleted/${page}`);
  };

  const actionRequest = ({ payload, method }) =>
    axiosInstance({
      url: "/require/action",
      method,
      data: payload,
    });

  const {
    data: sentMails,
    refetch: sentRefetch,
    isPending: sentLoading,
    error: sentError,
  } = useQuery({
    queryKey: ["trash", page],
    queryFn: sendRequest,
  });

  const {
    data: actionResponse,
    mutate: actionMutate,
    error: actionError,
  } = useMutation({
    mutationKey: ["trashaction"],
    mutationFn: actionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  useEffect(() => {
    if(sentError){
      const msg = sentError?.response?.data?.message;
      if(msg === "No Deleted Emails Found"){
        setNoDeletedEmails(true);
      }
    }  
  
  }, [ sentError ]);

  useEffect(() => {
    if (actionResponse || actionError) {
      if (actionResponse) {
        if (actionResponse?.data?.message === "Add To permanently_deleted Successfully ") {
          toast.success("Message Permanently Deleted");
        } else if(actionResponse?.data?.message === "Add To retrive Successfully "){
          toast.success("Message Retrived Successfully");
        }  else {
          console.log("no action error for inbox page");
        }
      }

      if (actionError) {
        const msg = actionError?.response?.data?.message;

        if (msg === "Internal Server Error") {
          // ✅ Replaced SweetAlert with toast
          toast.error(
            "An unexpected error occurred. Please try again later."
          );
        }
      }
    }
  }, [actionResponse, actionError]);

  const mailsFromApi = sentMails?.data?.data || [];

  // Filter
  // const mails = mailsFromApi.filter((m) => {
  //   if (!search) return true;

  //   const q = search.toLowerCase();

  //   return (
  //     m.subject?.toLowerCase().includes(q) ||
  //     m.messagePreview?.toLowerCase().includes(q) ||
  //     m.to?.some(
  //       (recipient) =>
  //         recipient.email.toLowerCase().includes(q) ||
  //         recipient.name?.toLowerCase().includes(q)
  //     )
  //   );
  // });


  const mails = mailsFromApi.filter((m) => {
  if (!search) return true;

  const q = search.toLowerCase();

  const fromEmail = m.from?.email?.toLowerCase() || "";
  const fromFullName = `${m.from?.first_name || ""} ${m.from?.last_name || ""}`
    .trim()
    .toLowerCase();

  // If you later have `to` as an array again:
  const toMatches = Array.isArray(m.to)
    ? m.to.some((recipient) => {
        const email = recipient.email?.toLowerCase() || "";
        const fullName = `${recipient.first_name || ""} ${recipient.last_name || ""}`
          .trim()
          .toLowerCase();
        return email.includes(q) || fullName.includes(q);
      })
    : false;

  return (
    m.subject?.toLowerCase().includes(q) ||
    m.messagePreview?.toLowerCase().includes(q) ||
    fromEmail.includes(q) ||
    fromFullName.includes(q) ||
    toMatches
  );
});

const visibleMails = mails.filter(
  (mail) =>
    !deleteOverrides.has(mail.emailId) &&
    !restoreOverrides.has(mail.emailId)
);


  // Select with emailId
  const toggleSelect = (emailId) => {
    setSelectedIds((prev) => {
      let next;
      if (prev.includes(emailId)) {
        next = prev.filter((x) => x !== emailId);
      } else {
        next = [...prev, emailId];
      }
      // console.log("Selected emailIds:", next);
      return next;
    });
  };

  const selectAll = () => {
    if (mails.length === 0) return;

    let next = [];
    if (selectedIds.length === mails.length) {
      next = [];
    } else {
      next = mails.map((m) => m.emailId);
    }
    // console.log("Selected emailIds (selectAll):", next);
    setSelectedIds(next);
  };

  const handleMailClick = (mailId, receiverId, senderId) => {
    setSelectedMailIdForPasskey(mailId);
    setSelectedSenderIdForPasskey(senderId);
    setSelectedReceiverIdForPasskey(receiverId);
    setShowPasskeyModal(true);
  };

  const handlePasskeySubmit = (passkey) => {
    isMutate({
      email_id: selectedMailIdForPasskey,
      receiver_id: selectedReceiverIdForPasskey,
      sender_id: selectedSenderIdForPasskey,
      passkey,
    });
  };

  useEffect(() => {
    if (isResponse || isError) {
      if (isResponse?.data?.message === "Success") {
        navigate(`/trashdetails/${selectedMailIdForPasskey}`, {
          state: {
            messageId: selectedMailIdForPasskey,
            response: isResponse?.data,
          },
        });
        setShowPasskeyModal(false);
      }

      if (isError?.response?.data?.message === "Invalid Passkey") {
        setPasskeyError("Invalid Passkey");
      }
    }
  }, [isResponse, isError, navigate, selectedMailIdForPasskey]);

  const allSelected = mails.length > 0 && selectedIds.length === mails.length;

  //  Open confirm modal for bulk delete
  const handledeleteall = () => {
    if (selectedIds.length > 0) {
      setConfirmContext({ mode: "bulk" });
      setConfirmOpen(true);
    }
  };

  //  Row actions (delete uses confirm modal, retrive calls directly)
  const handleRowAction = (type, emailId, receiverId, senderId) => {
    // For permanent delete show custom modal
    if (type === "permanently_deleted") {
      setConfirmContext({
        mode: "single",
        emailId,
        receiverId,
        senderId,
      });
      setConfirmOpen(true);
      return;
    }

    // For other actions (e.g., retrive) call directly
    let payload;
    if (receiverId) {
      payload = {
        email_id: [emailId],
        receiver_id: receiverId,
        action_type: type,
      };
    } else if (senderId) {
      payload = {
        email_id: [emailId],
        sender_id: senderId,
        action_type: type,
      };
    } else {
      console.warn("⚠ No senderId or receiverId provided!");
      return;
    }

    actionMutate({
      payload,
      method: "POST",
    });
  };

//   const uiDelete = (emailId, receiverId, senderId) => {
//   setDeleteOverrides((prev) => new Set(prev).add(emailId));

//   handleRowAction(
//     "permanently_deleted",
//     emailId,
//     receiverId,
//     senderId
//   );
// };

const uiRestore = (emailId, receiverId, senderId) => {
  setRestoreOverrides((prev) => new Set(prev).add(emailId));

  handleRowAction("retrive", emailId, receiverId, senderId);
};

  //  Actual delete execution when user confirms in modal
  const handleConfirmDelete = () => {
    if (!confirmContext) return;

    // Bulk delete using selectedIds
    if (confirmContext.mode === "bulk") {
        //  instant UI
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    selectedIds.forEach((id) => next.add(id));
    return next;
  });

      if (selectedIds.length === 0) {
        setConfirmOpen(false);
        setConfirmContext(null);
        return;
      }

      const firstMail = mails.find((m) => m.emailId === selectedIds[0]);
      const receiverId = firstMail?.receiver_id;
      const senderId = firstMail?.sender_id;
      let payload;
      if (receiverId) {
        payload = {
          email_id: selectedIds,
          receiver_id: receiverId,
          action_type: "permanently_deleted",
        };
      } else if (senderId) {
        payload = {
          email_id: selectedIds,
          sender_id: senderId,
          action_type: "permanently_deleted",
        };
      } else {
        console.warn("⚠ No senderId or receiverId provided!");
        setConfirmOpen(false);
        setConfirmContext(null);
        return;
      }

      actionMutate({
        payload,
        method: "POST",
      });
      setSelectedIds([]);
    }

    // Single delete using context values
    if (confirmContext.mode === "single") {
      const { emailId, receiverId, senderId } = confirmContext;
        //  optimistic UI AFTER confirm
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    next.add(emailId);
    return next;
  });
      let payload;
      if (receiverId) {
        payload = {
          email_id: [emailId],
          receiver_id: receiverId,
          action_type: "permanently_deleted",
        };
      } else if (senderId) {
        payload = {
          email_id: [emailId],
          sender_id: senderId,
          action_type: "permanently_deleted",
        };
      } else {
        console.warn("⚠ No senderId or receiverId provided!");
        setConfirmOpen(false);
        setConfirmContext(null);
        return;
      }

      actionMutate({
        payload,
        method: "POST",
      });
    }

    setConfirmOpen(false);
    setConfirmContext(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setConfirmContext(null);
  };

  const handleRefresh = () => {
    sentRefetch();
  };

  useEffect(() => {
  setDeleteOverrides(new Set());
  setRestoreOverrides(new Set());
}, [sentMails]);

  const isBulkMode = confirmContext?.mode === "bulk";

  return (
    <div className="bg-white w-full relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          {/* Header checkbox */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-[13px] h-[13px] accent-[#8A3FFA] cursor-pointer"
              onChange={selectAll}
              checked={allSelected}
            />
          </label>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-[#F3EBFF] transition"
          >
            <FiRefreshCw />
          </button>
          <button
            onClick={handledeleteall}
            disabled={selectedIds?.length === 0}
            className={`p-2 rounded-full hover:bg-[#F3EBFF] transition ${
              selectedIds?.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <FiTrash2 />
          </button>

          <button className="p-2 rounded-full hover:bg-[#F3EBFF] transition">
            <FiMoreVertical />
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
            {/* Left (Decrement page) */}
            <button
              className={`p-2 rounded hover:bg-[#F3EBFF] transition ${
                page === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft />
            </button>

            {/* Right (Increment page) */}
            <button
              className={`p-2 rounded hover:bg-[#F3EBFF] transition ${
                mails?.length < 50 ? "cursor-not-allowed opacity-50" : ""
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
      ) : mails.length === 0 || noDeletedEmails ? (
        <NoDataFound
    title="No Deleted Emails Found"
    subtitle="You don't have any deleted messages."
    className="h-[calc(100vh-110px)] overflow-hidden"
  />
      ) : (
        <div className="overflow-auto">
          <ul className="divide-y h-[calc(100vh-110px)]">
            {visibleMails.map((mail) => {
              const mailId = mail?.emailId;
              const receiverId = mail?.receiver_id;
              const senderId = mail?.sender_id;
              const isSelected = selectedIds.includes(mailId);

              return (
                <li
                  key={mailId}
                  className={`${mail?.is_read === false ? "bg-purple-50" : ""} group grid grid-cols-[20px_auto_200px_1fr_auto] items-center gap-4 px-4 py-2 hover:bg-[#F3EBFF] transition cursor-pointer`}
                  onClick={() => handleMailClick(mailId, receiverId, senderId)}
                >
                  {/* Checkbox */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      checked={isSelected}
                      onChange={() => toggleSelect(mailId)}
                      type="checkbox"
                      className="w-[13px] h-[13px] accent-[#8A3FFA] cursor-pointer"
                    />
                  </div>

                  {/* Undo column */}
                  <div
                    className="text-xs  bg-[#F5F3FF] text-[#A855F7] rounded-full px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      uiRestore(mailId, receiverId, senderId);
                    }}
                  >
                    Undo
                  </div>

                  {/* From Column */}
                  <div className="font-medium text-sm truncate">
                    {mail?.from?.first_name ||
                      (mail?.to?.length
                        ? mail.to.map((t) => t.first_name).join(", ")
                        : null) ||
                      "(No Sender)"}
                  </div>

                  {/* Subject + Preview */}
                  <div className="min-w-0 flex items-center gap-3 truncate">
                    <div
                      className={`font-semibold text-xs truncate ${
                        mail?.unread ? "text-gray-900" : "text-gray-800"
                      }`}
                    >
                      {mail?.subject || "(No Subject)"}
                    </div>

                    <span className="text-gray-400 flex-shrink-0">-</span>

                    <div className="text-xs text-gray-500 truncate hidden sm:block min-w-0">
                      {mail?.messagePreview || "(No Preview)"}
                    </div>
                  </div>

                  {/* Time + Hover Actions */}
                  <div className="text-sm text-gray-500 text-right">
                    {/* Default: show time */}
                    <span className="group-hover:hidden text-xs">
                      {formatMailTimestamp(mail?.created_at) || "Now"}
                    </span>

                    {/* On row hover: actions */}
                    <div className="hidden group-hover:flex items-center justify-end gap-2">
                      {/* Delete */}
                      <button
                        className="p-1 rounded-full hover:bg-[#c49dff]"
                        title="Delete"
                     onClick={(e) => {
  e.stopPropagation();
  setConfirmContext({
    mode: "single",
    emailId: mailId,
    receiverId,
    senderId,
  });
  setConfirmOpen(true);
}}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      {/* ❌ UnArchive removed */}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Passkey Modal */}
      <PasskeyModal
        open={showPasskeyModal}
        passkeyError={passkeyError}
        isLoading={isLoading}
        onClose={() => setShowPasskeyModal(false)}
        onSubmit={handlePasskeySubmit}
      />

      {/* ✅ Custom Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete permanently?"
        description={
          isBulkMode
            ? "Are you sure you want to permanently delete the selected messages? This action cannot be undone."
            : "Are you sure you want to permanently delete this message? This action cannot be undone."
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Trash;
