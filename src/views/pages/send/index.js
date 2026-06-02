// GmailLikeInbox.jsx
import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiRefreshCw,
  FiStar,
  FiSearch,
  FiTrash2,
  FiArchive,
} from "react-icons/fi"; // 👈 added icons here
// import { AiOutlineCheckSquare } from "react-icons/ai"; // ❌ no longer used
import PasskeyModal from "src/components/popups/PasskeyModal";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatMailTimestamp } from "src/utils/formateDateAndTimeUtils";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNotify } from "src/context/NotifyContext";
import Skeleton from "src/components/loaders/Skeliton";
import NoDataFound from "src/components/nodata/NoData";
const Send = () => {
  const [selectedIds, setSelectedIds] = useState([]); // will store emailId[]
  const [search, setSearch] = useState("");
  const [passkeyError, setPasskeyError] = useState(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [selectedMailIdForPasskey, setSelectedMailIdForPasskey] =
    useState(null);
  const [selectedSenderIdForPasskey, setSelectedSenderIdForPasskey] =
    useState(null);
  const [page, setPage] = useState(1);
    const [starOverrides, setStarOverrides] = useState(new Map());
const [archiveOverrides, setArchiveOverrides] = useState(new Map());
const [deleteOverrides, setDeleteOverrides] = useState(new Set());

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useNotify();
  const passkeyRequest = (payload) =>
    axiosInstance.get(
      `/require/message?emailId=${payload.email_id}&passkey=${payload.passkey}&senderId=${payload.sender_id}`
    );

  const {
    data: isResponse,
    mutate: isMutate,
    error: isError,
    isPending: isLoading,
  } = useMutation({
    mutationFn: passkeyRequest,
    mutationKey: ["sendpasskey"],
  });

  // const sendRequest = async () => await axiosInstance?.get(`/require/emails?page=${page}`);
  const sendRequest = async ({ queryKey }) => {
    const [, page] = queryKey;
    return axiosInstance.get(`/require/emails/${page}`);
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
  } = useQuery({
    queryKey: ["sent", page],
    queryFn: sendRequest,
  });

  const {
    data: actionResponse,
    mutate: actionMutate,
    error: actionError,
    // isPending: actionLoading,
  } = useMutation({
    mutationKey: ["sendaction"],
    mutationFn: actionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent"] });
    },
  });

  useEffect(() => {
    if (notify === "mailbox-submited") {
      sentRefetch();
    }
  }, [notify, sentRefetch]);

  useEffect(() => {
    if (actionResponse || actionError) {
      if (actionResponse) {
        if (actionResponse?.data?.message === "Add To favorite Successfully ") {
          toast.success("Message Starred Successfully");
        }  else if (actionResponse?.data?.message === "Undo favorite Successfully ") {
          toast.success("Message Unstarred Successfully");
        } else if (
          actionResponse?.data?.message === "Add To archived Successfully "
        ) {
          toast.success("Message Archived Successfully");
        } else if (
          actionResponse?.data?.message === "Add To deleted Successfully "
        ) {
          toast.success("Message Deleted Successfully");
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
         });
        }
      }
    }
  }, [actionResponse, actionError]);

  const mailsFromApi = sentMails?.data?.data || [];

  // filter
  // const mails = mailsFromApi.filter((m) => {
  //   if (!search) return true;

  //   const q = search.toLowerCase();

  //   return (
  //     m.subject?.toLowerCase().includes(q) ||
  //     m.messagePreview?.toLowerCase().includes(q) ||
  //     m.to.some(
  //       (recipient) =>
  //         recipient.email.toLowerCase().includes(q) ||
  //         recipient.name?.toLowerCase().includes(q)
  //     )
  //   );
  // });


  const mails = mailsFromApi.filter((m) => {
  if (!search) return true;

  const q = search.toLowerCase();

  return (
    m.subject?.toLowerCase().includes(q) ||
    m.messagePreview?.toLowerCase().includes(q) ||
    (m.to || []).some((recipient) => {
      const email = recipient.email?.toLowerCase() || "";
      const fullName = `${recipient.first_name || ""} ${recipient.last_name || ""}`
        .trim()
        .toLowerCase();

      return email.includes(q) || fullName.includes(q);
    })
  );
});

  // UI state filter (archive/delete instant)
const visibleMails = mails.filter(
  (mail) =>
    !archiveOverrides.get(mail.emailId) &&
    !deleteOverrides.has(mail.emailId)
);

  //  select / star work with emailId instead of id
  const toggleSelect = (emailId) => {
    setSelectedIds((prev) => {
      let next;
      if (prev.includes(emailId)) {
        next = prev.filter((x) => x !== emailId);
      } else {
        next = [...prev, emailId];
      }
      // console.log("Selected emailIds:", next); // log every time
      return next;
    });
  };

  const toggleStar = (emailId, senderid, isStarred) => {
       setStarOverrides((prev) => {
      const next = new Map(prev);
      const current = next.has(emailId)
        ? next.get(emailId)
        : mails.find((m) => m.emailId === emailId)?.favorite;

      next.set(emailId, !current);
      return next;
    });
    const payload = {
      email_id: [emailId],
      sender_id: senderid,
      action_type: "favorite",
    };

    actionMutate({
      payload,
      method: isStarred ? "PUT" : "POST",
    });
  };

  const selectAll = () => {
    if (mails.length === 0) return;

    let next = [];
    if (selectedIds.length === mails.length) {
      // unselect all
      next = [];
    } else {
      // select all emailIds
      next = mails.map((m) => m.emailId);
    }
    // console.log("Selected emailIds (selectAll):", next);
    setSelectedIds(next);
  };

  const handleMailClick = (mailId, senderid) => {
    setSelectedMailIdForPasskey(mailId);
    setSelectedSenderIdForPasskey(senderid);
    setShowPasskeyModal(true);
  };

  const handlePasskeySubmit = (passkey) => {
    isMutate({
      email_id: selectedMailIdForPasskey,
      sender_id: selectedSenderIdForPasskey,
      passkey,
    });
  };

  useEffect(() => {
    if (isResponse || isError) {
      if (isResponse?.data?.message === "Success") {
        navigate(`/senddetails/${selectedMailIdForPasskey}`, {
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

  // header checkbox state
  const allSelected = mails.length > 0 && selectedIds.length === mails.length;

  // handle delete all or induadual
  const handledeleteall = () => {
    if (selectedIds.length > 0) {
              //  instant UI update
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    selectedIds.forEach((id) => next.add(id));
    return next;
  });
      const firstMail = mails.find((m) => m.emailId === selectedIds[0]);
      const senderId = firstMail?.senderId;
      const payload = {
        email_id: selectedIds,
        sender_id: senderId,
        action_type: "deleted",
      };
      actionMutate({
        payload,
        method: "POST",
      });
      setSelectedIds([]);
    }
  };

  // 👇 NEW: generic row action handler (just console logs)
  const handleRowAction = (type, emailId, senderId) => {
    const payload = {
      email_id: [emailId],
      sender_id: senderId,
      action_type: type,
    };
    actionMutate({
      payload,
      method: "POST",
    });
    // actionMutate(payload);
  };

    const uiArchive = (emailId, receiverId) => {
  // instant UI
  setArchiveOverrides((prev) => {
    const next = new Map(prev);
    next.set(emailId, true);
    return next;
  });

  // existing API call
  handleRowAction("archived", emailId, receiverId);
};

const uiDelete = (emailId, receiverId) => {
  // instant UI
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    next.add(emailId);
    return next;
  });

  // existing API call
  handleRowAction("deleted", emailId, receiverId);
};

  const handleRefresh = () => {
    sentRefetch();
  };

  return (
    <div className="bg-white w-full relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          {/* 🔁 New header checkbox design */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-[13px] h-[13px] accent-blue-600 cursor-pointer"
              onChange={selectAll}
              checked={allSelected}
            />
          </label>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiRefreshCw />
          </button>
          <button
            onClick={handledeleteall}
            disabled={selectedIds?.length === 0}
            className={`p-2 rounded-full hover:bg-gray-100 transition ${
              selectedIds?.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <FiTrash2 />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <FiMoreVertical />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-gray-50 border rounded-full px-3 py-1 gap-2">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mail"
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Left (Decrement) */}
            <button
              className={`p-2 rounded hover:bg-gray-100 transition ${
                page === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft />
            </button>

            {/* Right (Increment) */}
            <button
              className={`p-2 rounded hover:bg-gray-100 transition ${
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
      ) : mails?.length === 0 ? (
        <NoDataFound
          title="No Sent Emails Found"
          subtitle="You don't have any sent messages."
          className="h-[calc(100vh-110px)] overflow-hidden"
        />
      ) : (
        <div className="overflow-auto">
          <ul className="divide-y h-[calc(100vh-110px)]">
            {visibleMails.map((mail) => {
              const mailId = mail?.emailId;
              const senderid = mail?.senderId;
              const isSelected = selectedIds.includes(mailId);
              // const isStarred = starredIds.includes(mailId);
              // const isStarred = mail?.favorite === true;
                 const isStarred = starOverrides.has(mail.emailId)
                ? starOverrides.get(mail.emailId)
                : mail.favorite === true;

              return (
                <li
                  key={mailId}
                  className="group grid grid-cols-[20px_20px_200px_1fr_auto] items-center gap-4 px-4 py-2 hover:bg-gray-50 transition cursor-pointer" // 👈 added `group`
                  onClick={() => handleMailClick(mailId, senderid)}
                >
                  {/* Checkbox */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                      checked={isSelected}
                      onChange={() => toggleSelect(mailId)}
                      type="checkbox"
                      className="w-[13px] h-[13px] accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Star */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleStar(mailId, senderid, isStarred)}
                      className="hover:text-yellow-500"
                    >
                      <FiStar
                        className={`${
                          isStarred ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    </button>
                  </div>

                  {/* To Column */}
                  <div className="font-medium text-sm truncate">
                    <span className="text-gray-400 mr-2">To:</span>
                    {mail?.to?.map((name) => name?.first_name).join(", ")}
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

                  {/* Time + Hover Actions (Gmail-like) */}
                  <div className="text-sm text-gray-500 text-right">
                    {/* Default: show time */}
                    <span className="group-hover:hidden text-xs">
                      {formatMailTimestamp(mail?.created_at) || "Now"}
                    </span>

                    {/* On row hover: show actions */}
                    <div
                      className="hidden group-hover:flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()} // ❗ prevent opening mail
                    >
                      {/* Delete */}
                      <button
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Delete"
                        onClick={() =>
                          uiDelete(mailId, senderid)
                        }
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      {/* Archive */}
                      <button
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Archive"
                        onClick={() =>
                          uiArchive(mailId, senderid)
                        }
                      >
                        <FiArchive className="w-4 h-4" />
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
      <PasskeyModal
        open={showPasskeyModal}
        passkeyError={passkeyError}
        isLoading={isLoading}
        onClose={() => setShowPasskeyModal(false)}
        onSubmit={handlePasskeySubmit}
      />
    </div>
  );
};

export default Send;
