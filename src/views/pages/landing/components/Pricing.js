import React, { useState } from "react";
import { Check, X } from "lucide-react";

const Pricing = () => {
  const [billing, setBilling] = useState("yearly");

  const toggle = (val) => setBilling(val);

  const PLANS = [
    {
      name: "Kyberra Standard",
      price: billing === "yearly" ? "$276.48" : "$29",
      period: billing === "yearly" ? "yr" : "mo",
      description:
        "Enhanced features for daily secure communication.",
      popular: false,
      button: { text: "Get Started", variant: "outline" },
      features: [
        { text: "Presence-Based Auth", included: true },
        { text: "100GB Secure Storage", included: true },
        { text: "Dual-Person Keys", included: false },
      ],
    },
    {
      name: "Kyberra Premium",
      price: billing === "yearly" ? "$460.80" : "$40",
      period: billing === "yearly" ? "yr" : "mo",
      description:
        "Complete security suite for mission-critical privacy.",
      popular: true,
      button: { text: "Get started", variant: "dark" },
      features: [
        { text: "All Standard Features", included: true },
        { text: "Dual-Person Keys", included: true },
        { text: "Visual Illusion UI", included: true },
        { text: "Priority Support", included: true },
      ],
    },
    {
      name: "Kyberra Premium Pro",
      price: billing === "yearly" ? "$622.08" : "$54",
      period: billing === "yearly" ? "yr" : "mo",
      description:
        "Maximum security for high-risk organizations.",
      popular: false,
      button: { text: "Contact sales", variant: "outline" },
      features: [
        { text: "Unlimited Storage", included: true },
        { text: "24/7 Priority Ops", included: true },
        { text: "Stealth Mode API", included: true },
        { text: "Custom Integration", included: true },
      ],
    },
  ];

  const Toggle = () => (
    <div className="inline-flex items-center bg-[#1A062F] rounded-full p-1 shadow-md">
      {["yearly", "monthly"].map((val) => (
        <button
          key={val}
          onClick={() => toggle(val)}
          className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
            billing === val
              ? "bg-white text-[#1A062F]"
              : "text-white/70 hover:text-white"
          }`}
        >
          {val === "yearly" ? "Annually" : "Monthly"}
        </button>
      ))}
    </div>
  );

  return (
    <section id="pricing" className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-xl border border-[#A14FFC85] bg-[#A14FFC26] mb-4">
            <span className="text-[10px] tracking-wide font-semibold text-[#645A7D]">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Choose Your{" "}
            <span className="text-[#AF7BFD]">
              Privacy Level
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto pb-0 lg:pb-10 leading-relaxed">
            Choose scalable security solutions tailored for
            individuals, teams, and enterprises seeking
            uncompromised privacy and adaptive protection.
          </p>

          {/* Mobile Toggle */}
          <div className="flex justify-center mt-2 md:mt-6 lg:hidden">
            <Toggle />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-5 xl:gap-7">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`relative w-full max-w-[360px] rounded-[32px] border transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#FFFEFD] via-[#EEDEF9] to-[#DCC6F4] border-[#AF7BFD] shadow-[0px_8px_40px_rgba(175,123,253,0.35)] lg:-mt-8 z-10"
                  : "bg-white border-[#D9D9D9] shadow-[0px_4px_20px_rgba(0,0,0,0.08)]"
              }`}
            >
              <div className="flex flex-col h-full p-6 sm:p-7">
                {/* Desktop Toggle */}
                {plan.popular && (
                  <div className="hidden lg:flex justify-center mb-6">
                    <Toggle />
                  </div>
                )}

                {/* Top */}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[18px] font-bold text-[#1A062F] font-[Space_Grotesk]">
                    {plan.name}
                  </h3>

                  {plan.popular && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[#DDFBE6] text-[#16A34A] border border-[#86EFAC]">
                      Save 20%
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-[48px] leading-none font-bold text-[#1A062F]">
                    {plan.price}
                  </span>

                  <span className="text-sm text-gray-500 mb-2">
                    /{plan.period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#6B7280] leading-relaxed mb-7 min-h-[50px]">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-[#1A062F] flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}

                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-[#1F2937]"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  className={`mt-8 w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    plan.button.variant === "dark"
                      ? "bg-[#1A062F] text-white hover:bg-[#2A1045]"
                      : "bg-[#F5F3F7] text-[#1A062F] hover:bg-[#ECE7F2]"
                  }`}
                >
                  {plan.button.text}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;