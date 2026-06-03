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
} from "react-icons/fi";
import PasskeyModal from "src/components/popups/PasskeyModal";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatMailTimestamp } from "src/utils/formateDateAndTimeUtils";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Skeleton from "src/components/loaders/Skeliton";
import NoDataFound from "src/components/nodata/NoData";
const Starred = () => {
  const [selectedIds, setSelectedIds] = useState([]); // emailId[]
  // const [starredIds, setStarredIds] = useState([]); // emailId[]
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
  const [noStarredEmails, setNoStarredEmails] = useState(false);
const [deleteOverrides, setDeleteOverrides] = useState(new Set());
const [archiveOverrides, setArchiveOverrides] = useState(new Set());
const [unstarOverrides, setUnstarOverrides] = useState(new Set());
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
    mutationKey: ["starredpasskey"],
  });

  const sendRequest = async ({ queryKey }) => {
    const [, page] = queryKey;
    return axiosInstance.get(`/require/favorite/${page}`);
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
    queryKey: ["starred", page],
    queryFn: sendRequest,
  });

  const {
    data: actionResponse,
    mutate: actionMutate,
    error: actionError,
    // isPending: actionLoading,
  } = useMutation({
    mutationKey: ["starredaction"],
    mutationFn: actionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred"] });
    },
  });
  useEffect(() => {
    if (sentError) {
      const msg = sentError?.response?.data?.message;
      if (msg === "No Favorite Emails Found") {
        setNoStarredEmails(true);
      }
    }
  }, [sentError]);

  useEffect(() => {
    if (actionResponse || actionError) {
      if (actionResponse) {
        if (actionResponse?.data?.message === "Add To favorite Successfully ") {
          toast.success("Message Starred Successfully");
        } else if (
          actionResponse?.data?.message === "Add To archived Successfully "
        ) {
          toast.success("Message Archived Successfully");
        } else if (
          actionResponse?.data?.message === "Add To deleted Successfully "
        ) {
          toast.success("Message Deleted Successfully");
        } else {
          console.log("no action error for inbox page");
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

  // Filter
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

  const visibleMails = mails.filter(
  (mail) =>
    !deleteOverrides.has(mail.emailId) &&
    !archiveOverrides.has(mail.emailId) &&
    !unstarOverrides.has(mail.emailId)
);

  // Select / star with emailId
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

  const toggleStar = (emailId, receiverId, senderId, isStarred) => {
    // const payload = {
    //   email_id: [emailId],
    //   receiver_id: receiverId,
    //   action_type: "favorite",
    // };

    let payload;
    if (receiverId) {
      payload = {
        email_id: [emailId],
        receiver_id: receiverId,
        action_type: "favorite",
      };
    } else if (senderId) {
      payload = {
        email_id: [emailId],
        sender_id: senderId,
        action_type: "favorite",
      };
    } else {
      console.warn("⚠ No senderId or receiverId provided!");
      return;
    }

    actionMutate({
      payload,
      method: isStarred ? "PUT" : "POST",
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
        navigate(`/starreddetails/${selectedMailIdForPasskey}`, {
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

  const handledeleteall = () => {
    if (selectedIds.length > 0) {
        // instant UI
  setDeleteOverrides((prev) => {
    const next = new Set(prev);
    selectedIds.forEach((id) => next.add(id));
    return next;
  });
      const firstMail = mails.find((m) => m.emailId === selectedIds[0]);
      const receiverId = firstMail?.receiver_id;
      const senderId = firstMail?.sender_id;
      let payload;
      if (receiverId) {
        payload = {
          email_id: selectedIds,
          receiver_id: receiverId,
          action_type: "deleted",
        };
      } else if (senderId) {
        payload = {
          email_id: selectedIds,
          sender_id: senderId,
          action_type: "deleted",
        };
      } else {
        console.warn("⚠ No senderId or receiverId provided!");
        return;
      }
      // actionMutate(payload);
      actionMutate({
        payload,
        method: "POST",
      });
      setSelectedIds([]);
    }
  };

  const handleRowAction = (type, emailId, receiverId, senderId) => {
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

  const uiDelete = (emailId, receiverId, senderId) => {
  setDeleteOverrides((prev) => new Set(prev).add(emailId));
  handleRowAction("deleted", emailId, receiverId, senderId);
};

const uiArchive = (emailId, receiverId, senderId) => {
  setArchiveOverrides((prev) => new Set(prev).add(emailId));
  handleRowAction("archived", emailId, receiverId, senderId);
};

const uiUnstar = (emailId, receiverId, senderId) => {
  setUnstarOverrides((prev) => new Set(prev).add(emailId));

  let payload;
  if (receiverId) {
    payload = {
      email_id: [emailId],
      receiver_id: receiverId,
      action_type: "favorite",
    };
  } else {
    payload = {
      email_id: [emailId],
      sender_id: senderId,
      action_type: "favorite",
    };
  }

  actionMutate({
    payload,
    method: "PUT", // remove from favorite
  });
};

useEffect(() => {
  setDeleteOverrides(new Set());
  setArchiveOverrides(new Set());
  setUnstarOverrides(new Set());
}, [sentMails]);

  const handleRefresh = () => {
    sentRefetch();
  };

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
      ) : mails?.length === 0 || noStarredEmails ? (
        <NoDataFound
          title="No Starred Emails Found"
          subtitle="You don't have any starred messages."
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
              // const isStarred = mail?.favorite === true;

              return (
                <li
                  key={mailId}
                  className={` ${mail?.is_read === false ? "bg-purple-50" : ""} group grid grid-cols-[20px_20px_200px_1fr_auto] items-center gap-4 px-4 py-2 hover:bg-[#F3EBFF] transition cursor-pointer`}
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

                  {/* Star */}
                  <div onClick={(e) => e.stopPropagation()}>
                    {/* <button
                      onClick={() =>
                        toggleStar(mailId, receiverId, senderId, isStarred)
                      }
                      className="hover:text-yellow-500"
                    >
                      <FiStar
                        className={`${
                          isStarred ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    </button> */}
                    <button
  onClick={() => uiUnstar(mailId, receiverId, senderId)}
  className="hover:text-yellow-500"
>
  <FiStar className="text-yellow-500" />
</button>
                  </div>

                  {/* From Column */}
                  <div className="font-medium text-sm truncate">
                    {/* <span className="text-gray-400 mr-2">From:</span> */}
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
                        className="p-1 rounded-full hover:bg-[#cfafff]"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          uiDelete(
                            mailId,
                            receiverId,
                            senderId
                          );
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>

                      {/* Archive */}
                      <button
                        className="p-1 rounded-full hover:bg-[#cfafff]"
                        title="Archive"
                        onClick={(e) => {
                          e.stopPropagation();
                          uiArchive(
                            mailId,
                            receiverId,
                            senderId
                          );
                        }}
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

export default Starred;
