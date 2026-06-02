import React from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Cpu,
  Fingerprint,
  Cloud,
  ShieldCheck,
  Eye,
  ArrowRightLeft
} from 'lucide-react';

const Encryption = () => {
  const STEPS = [
    {
      icon: Key,
      step: "01",
      title: "Local Encryption",
      description: "All emails are encrypted on your device using your private keys before leaving your browser.",
      gradient: "from-emerald-500 to-teal-500",
      features: ["Client-side processing", "Zero data exposure"]
    },
    {
      icon: Cloud,
      step: "02",
      title: "Secure Transmission",
      description: "Encrypted data travels through multiple layers of TLS protection to our secure Swiss servers.",
      gradient: "from-blue-500 to-cyan-500",
      features: ["TLS 1.3 Protocol", "Perfect Forward Secrecy", "256-bit encryption"]
    },
    {
      icon: Lock,
      step: "03",
      title: "Private Delivery",
      description: "Only the intended recipient with the correct private key can decrypt and read your messages.",
      gradient: "from-indigo-500 to-purple-500",
      features: ["End-to-end encrypted", "Zero-access storage"]
    }
  ];

  // const SECURITY_FEATURES = [
  //   {
  //     icon: Fingerprint,
  //     title: "Biometric Protection",
  //     description: "Secure access with Face ID, Touch ID, or device PIN"
  //   },
  //   {
  //     icon: ShieldCheck,
  //     title: "Automatic Key Rotation",
  //     description: "Regular key updates for maximum security"
  //   },
  //   {
  //     icon: Cpu,
  //     title: "Hardware Security",
  //     description: "Utilizes secure hardware enclaves when available"
  //   },
  //   {
  //     icon: Eye,
  //     title: "Self-Destructing Messages",
  //     description: "Optional auto-delete for sensitive conversations"
  //   }
  // ];

  return (
    <section id='security' className="relative  px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden mt-5 sm:mt-6 lg:mt-7">
      {/* Background Elements - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-full blur-2xl md:blur-3xl" />
        <div className="hidden sm:block absolute top-1/2 -left-20 sm:-left-40 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-emerald-50 rounded-full blur-2xl md:blur-3xl opacity-40" />
        <div className="hidden sm:block absolute bottom-0 -right-20 sm:-right-40 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-indigo-50 rounded-full blur-2xl md:blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-xl border border-[#A14FFC85] bg-[#A14FFC26] mb-4">
            <span className="text-[10px] tracking-wide font-semibold text-[#645A7D]">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            How your privacy is{" "}
            <span className="text-[#AF7BFD]">
              Protected
            </span>
          </h2>
          </div>

      {/* Timeline Steps */}
<div className="relative max-w-6xl mx-auto px-4 py-5  sm:py-6 md:py-12 lg:py-14 sm:px-6 lg:px-8 pl-0 sm:pl-2.5 ">
{/*bottom blur */}
<div className="absolute bottom-0 left-0 right-0 h-5 sm:h-7 md:h-16 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-20 "/>
  {/* Center Line */}
  <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 h-full w-[2px] bg-[#E9D8FD] md:-translate-x-1/2 "  />


  <div className="space-y-14 sm:space-y-16 md:space-y-28">
    {STEPS.map((step, index) => {
      const isLeft = index % 2 === 0;

      return (
        <div
          key={index}
          className={`relative flex flex-col md:flex-row ${
            isLeft ? "md:justify-start" : "md:justify-end"
          }`}
        >
          {/* Step Number */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 -translate-x-1/2 z-20 flex">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl mt-1 sm:mt-4 md:mt-7 lg:mt-10 bg-[#2B0A4D] border border-[#DAB9FF] flex items-center justify-center shadow-lg">
              <span className="text-[#DAB9FF] font-semibold text-xs sm:text-sm">
                {step.step}
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className={`w-full md:w-[42%]  ${
              isLeft
                ? "md:text-right md:pr-1 pl-12 sm:pl-5"
                : "md:text-left md:pl-1 pl-12 sm:pl-5"
            }`}
          >
          

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#111111]  mt-2 mb-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-[15px] leading-6 sm:leading-7 text-[#666] mb-5 max-w-md">
              {step.description}
            </p>

            {/* Features */}
            <div className="space-y-3">
              {step.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 ${
                    isLeft
                      ? "md:justify-end"
                      : "md:justify-start"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-[#DAB9FF] flex-shrink-0 ${
                        isLeft ? "lg:order-2" : ""
                  }`} />

                  <span className="text-[9px] sm:text-[10px] md:[12px] lg:text-[14px] text-[#444] font-Inter ">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>        
      );
    })}
  </div>
</div>  

        {/* Additional Security Features */}
        {/* <div className="mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8 md:mb-10">
            Advanced Security Features
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SECURITY_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group p-4 sm:p-6 rounded-lg md:rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg md:hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex p-2 sm:p-3 rounded-lg bg-blue-50 border border-blue-100 mb-3 sm:mb-4 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                  {feature.title}
                </h4>
                
                <p className="text-xs sm:text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Technical Specifications */}
        {/* <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 sm:p-6 md:p-8 lg:p-10 mb-8 sm:mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Technical Excellence
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Our encryption stack combines industry-standard protocols with 
                cutting-edge privacy technologies to deliver unparalleled security.
              </p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Encryption Standard", value: "AES-256-GCM" },
                  { label: "Key Exchange", value: "RSA-4096" },
                  { label: "Hash Algorithm", value: "SHA-384" },
                  { label: "TLS Version", value: "1.3+" },
                ].map((spec, idx) => (
                  <div key={idx} className="p-3 sm:p-4 rounded-lg bg-white border border-blue-100">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">{spec.label}</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:pl-6 md:lg:pl-8 lg:border-l lg:border-blue-200 mt-6 lg:mt-0">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-3 sm:border-4 border-blue-200 animate-pulse" />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-indigo-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bottom CTA */}
        {/* <div className="text-center px-2 sm:px-0">
          <div className="inline-block p-0.5 sm:p-1 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 w-full max-w-lg mx-auto">
            <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 rounded-xl md:rounded-2xl bg-white">
              <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Experience Truly Private Email
              </h4>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5">
                Join millions who trust their communications to our secure platform.
              </p>
              <button className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 text-sm sm:text-base">
                Start Free Trial
              </button> 
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Encryption;