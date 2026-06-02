import React from "react";

// Import screenshots
import signup from "src/assets/images/setup-images/signup.png";
import secureAccount from "src/assets/images/setup-images/secure-account.png";
import signin from "src/assets/images/setup-images/signin.png";
import inbox from "src/assets/images/setup-images/inbox.png";
import profileTooltip from "src/assets/images/setup-images/profile-tooltip.png";
import openProfile from "src/assets/images/setup-images/open-profile.png";
import setPasskey from "src/assets/images/setup-images/set-passkey.png";
import passkeyForm from "src/assets/images/setup-images/passkey-form.png";
import passkeyPopup from "src/assets/images/setup-images/passkey-popup.png";

const steps = [
  {
    title: "Create your account",
    description:
      "Start by creating your Crypsyn account using your name, Gmail address, and phone number. This is used only for verification and recovery.",
    image: signup,
  },
  {
    title: "Secure your account",
    description:
      "Choose your Crypsyn email address and create a strong password. This password protects your account access.",
    image: secureAccount,
  },
  {
    title: "Sign in to Crypsyn",
    description:
      "Log in using your Crypsyn email and password to access your encrypted mailbox.",
    image: signin,
  },
  {
    title: "Access your mailbox",
    description:
      "After signing in, you will land on your inbox. All messages here are end-to-end encrypted.",
    image: inbox,
  },
  {
    title: "Open your profile",
    description:
      "Click on your profile avatar in the top-right corner to manage security settings.",
    image: openProfile,
  },
  {
    title: "Go to Profile",
    description:
      "From the menu, select Profile to open your account details and encryption settings.",
     image: profileTooltip,
  },
  {
    title: "Set your passkey",
    description:
      "Passkey adds an extra security layer. You must set it before viewing encrypted messages.",
    image: setPasskey,
  },
  {
    title: "Create your passkey",
    description:
      "Enter the verification token and create a numeric passkey. This passkey is required to decrypt messages.",
    image: passkeyForm,
  },
  {
    title: "Unlock encrypted messages",
    description:
      "Whenever you open encrypted messages, enter your passkey to securely decrypt and view them.",
    image: passkeyPopup,
  },
];

const PublicSetupGuide = () => {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Crypsyn Secure Mail Setup Guide
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Follow these steps to securely set up your encrypted email and
            protect your private messages.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-14">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Text */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-sm mb-4">
                  {index + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              Important Security Notice
            </h3>
            <p className="text-sm sm:text-base text-indigo-600">
              Your passkey is never stored on our servers. If you forget it,
              encrypted messages cannot be recovered. Keep it safe and never
              share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSetupGuide;
