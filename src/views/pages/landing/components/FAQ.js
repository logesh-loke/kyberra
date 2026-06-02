import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Users,
  Zap,
  Clock,
  ChevronDown
} from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  const faqs = [
    {
      question: "What happens if I forget my password?",
      answer:
        "Since we don't store your encryption keys, we cannot reset your password. However, we provide a secure recovery process during setup. We strongly recommend enabling our recovery options and storing your recovery key in a safe place.",
      icon: HelpCircle,
      category: "Account"
    },
    {
      question: "Is SecureMail compliant with GDPR and HIPAA?",
      answer:
        "Yes, SecureMail is fully compliant with GDPR, HIPAA, and other global privacy regulations. Our Swiss-based infrastructure provides additional legal protections under Switzerland's strict privacy laws. Business plans include compliance documentation and signed BAAs.",
      icon: Users,
      category: "Compliance"
    },
    {
      question: "How fast is email delivery with encryption?",
      answer:
        "Encryption adds minimal overhead—typically less than 100 milliseconds. Our global network of servers ensures your emails are delivered instantly worldwide.",
      icon: Zap,
      category: "Performance"
    },
    {
      question: "Do you offer enterprise and team plans?",
      answer:
        "Yes! Our Premium and Premium Pro plans are designed for teams and organizations.",
      icon: Users,
      category: "Business"
    },
    {
      question: "What's your uptime guarantee?",
      answer:
        "We guarantee 99.9% uptime for all paid plans, with real-time monitoring and automatic failover.",
      icon: Clock,
      category: "Reliability"
    }
  ];

  return (
    <section
      id="faq"
      className="relative py-1 sm:py-4 md:py-6 lg:py-8 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50 to-white"
    >
      <div className="max-w-2xl mx-auto mb-10 text-center">

        {/* Badge */}
        <div className="inline-flex items-center px-3 py-0.5 rounded-xl border border-[#A14FFC85] bg-[#A14FFC26] my-4 mx-auto">
          <span className="text-[10px] text-[#645A7D] font-semibold tracking-wide">
            SIMPLE, TRANSPARENT PRICING
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Frequently Asked <span className="text-[#AF7BFD]">Questions</span>
        </h2>

        {/* Description */}
        <p className="text-[12px] lg:text-[16px] text-gray-500 mb-6">
          Choose scalable security solutions tailored for individuals, teams,
          and enterprises seeking uncompromised privacy and adaptive protection.
        </p>

        {/* FAQ Cards */}
        <div className="space-y-3">
          {[
            {
              q: "How does environment-based encryption work?",
              a: `Kyberra uses a multi-factor environmental handshake. It verifies GPS coordinates, local Wi-Fi signatures, and proximity to other authorized devices before generating the final fragment of the decryption key.`
            },
            {
              q: "What happens if I lose my device?",
              a: `Since your keys are never stored on our servers, we cannot recover them. However, our Silence Trigger can auto-wipe local data if a remote signal is not received.`
            },
            {
              q: "Is Kyberra compliant with GDPR and HIPAA?",
              a: `Yes. Kyberra exceeds GDPR and HIPAA requirements using zero-knowledge architecture and end-to-end encryption.`
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-[#1A0B2E] border border-[#4B4452] hover:shadow-md transition-shadow"
            >
                <button
        onClick={() =>
          setOpenIndex(openIndex === idx ? null : idx)
        }
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <h4 className="text-sm font-semibold text-white pr-3">
          {faq.q}
        </h4>

        <ChevronDown
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            openIndex === idx ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
         openIndex === idx
           ? "grid-rows-[1fr] opacity-100"
           : "grid-rows-[0fr] opacity-0"
          }`}
          >
          <div className="overflow-hidden">
            <p className="text-xs text-gray-400 text-left px-4 pb-4 leading-relaxed">
              {faq.a}
            </p>
          </div>
      </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center px-2 pt-0 sm:pt-1 lg:pt-10 pb-1 sm:pb-6 sm:px-3">
        <div className="inline-flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl bg-[linear-gradient(135deg,rgba(175,123,253,0.588)_0%,rgba(211,188,249,0.3)_100%)] w-full max-w-2xl mx-auto border border-violet-400">

          <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Still Have Questions?
          </h4>

          <p className="text-[9px] sm:text-[11px] md:text-[12px] lg:text-[13px] text-black ">
            Our expert security team is ready to help you architect your secure communications protocol.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4 w-full sm:w-auto">
            <Link
              to="/contact"
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg bg-[#DAB9FF] text-[#460283] font-semibold hover:from-blue-700/50 hover:to-indigo-700/50 transition-all duration-300 shadow-lg  text-sm sm:text-base text-center"
            > 
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;