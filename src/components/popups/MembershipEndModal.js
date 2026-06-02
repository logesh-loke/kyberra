import React from "react";

const MembershipEndModal = ({
  onClose,
  onRemindLater,
  isExpiredToday,
  daysLeft,
}) => {
  // Build "3 days" / "1 day" text when not expired yet
  const hasDaysLeft =
    !isExpiredToday && typeof daysLeft === "number" && daysLeft > 0;

  const daysText = hasDaysLeft
    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"}`
    : null;

  const title = isExpiredToday
    ? "Plan Expired Today"
    : daysText
    ? `Plan expires in ${daysText}`
    : "Plan Expiring Soon";

  const subtitle = isExpiredToday
    ? "Your organization's subscription has expired today."
    : daysText
    ? `Your organization’s subscription will expire in ${daysText}.`
    : "Your organization’s subscription will expire soon.";

  const planStatus = isExpiredToday
    ? "Expired Today"
    : daysText
    ? `Expiring in ${daysText}`
    : "Expiring Soon";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md px-6 py-5">
        {/* Title */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Highlight Box */}
        <div className="my-4 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
          <p className="text-xs text-amber-700">
            Access to email services and team features has been temporarily
            restricted.
          </p>
        </div>

        {/* Info */}
        <div className="mb-4 space-y-1">
          <p className="text-xs text-gray-500">
            📦 Plan Status:
            <span className="ml-1 font-medium text-gray-700">
              {planStatus}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            👤 Action Required:
            <span className="ml-1 font-medium text-gray-700">
              Contact your administrator
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          {/* Remind me later only BEFORE expiry */}
          {!isExpiredToday && onRemindLater && (
            <button
              onClick={onRemindLater}
              className="px-3.5 py-1.5 text-sm rounded-lg border 
                         border-gray-200 text-gray-700 
                         hover:bg-gray-50 transition"
            >
              Remind me later
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-lg
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       text-white font-medium
                       hover:from-indigo-700 hover:to-purple-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:ring-offset-2 transition-all
                       shadow-lg hover:shadow-xl
                       transform hover:-translate-y-0.5"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipEndModal;
