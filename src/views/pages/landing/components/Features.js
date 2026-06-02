import React from 'react';
import { 
  Shield, 
  Users, 
  Clock3, 
  Zap,
  Lock, 
  Cloud,
  Smartphone,
  MessageSquare,
  BarChart,
  MapPin,
  Handshake,
  ShieldAlert,
  Eye,
  Radio,
  KeyRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const stats = [
  {
    icon: <Shield className="w-7 h-7 text-blue-600" />,
    head: "10M+",
    sub: "Encrypted Daily",
    color: "text-blue-600",
  },
  {
    icon: <Users className="w-7 h-7 text-violet-600" />,
    head: "150+",
    sub: "Countries",
    color: "text-violet-600",
  },
  {
    icon: <Clock3 className="w-7 h-7 text-emerald-600" />,
    head: "99.9%",
    sub: "Uptime",
    color: "text-emerald-600",
  },
  {
    icon: <Zap className="w-7 h-7 text-orange-500" />,
    head: "Zero",
    sub: "Data Breaches",
    color: "text-orange-500",
  },
];

  const FEATURES = [
    {
      icon: MapPin,
      title: "Presence-Based Access",
      description: "Messages open only when trusted devices, locations, or environments are verified.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-emerald-100"
    },
    {
      icon: Handshake,
      title: "Dual-Person Decryption",
      description: "Both sender and receiver must verify together before messages decrypt.",
       gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-purple-100"
    },
    {
      icon: ShieldAlert,
      title: "Silence Trigger Encryption",
      description: "Detects threats like screen recording or remote access and instantly re-encrypts.",
       gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-blue-100"
    },
    {
      icon: Eye,
      title: "Visual Illusion Encryption",
      description: "Sensitive messages appear as fake or harmless content until verified securely.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-amber-100"
    },
    {
      icon: Radio,
      title: "Environment Verification",
      description: "Authorized Bluetooth devices and secure systems become part of authentication.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-violet-100"
    },
    {
      icon: Zap,
      title: "Instant Self Protection",
      description: "Messages disappear or lock automatically when suspicious activity is detected.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-red-100"
    },
    {
      icon: Lock,
      title: "Zero-Access Privacy",
      description: "Kyberra cannot read, scan, or analyze your encrypted communications.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-indigo-100"
    },
    {
      icon: KeyRound,
      title: "Adaptive Secure Sessions",
      description: "Temporary encrypted sessions provide secure real-time verification between users.",
      gradient: "from-[#AF7BFD] to-[#A855F7]",
      bg: "bg-[#A855F7]",
      border: "border-green-100"
    }
  ];

  const ENTERPRISE_FEATURES = [
    {
      icon: Cloud,
      title: "Secure Cloud Storage",
      value: "10GB included, encrypted at rest"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      value: "iOS & Android with biometric unlock"
    },
    {
      icon: MessageSquare,
      title: "Encrypted Chat",
      value: "Built-in secure messaging"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      value: "Privacy-first usage insights"
    }
  ];


  return (
    <section id='features' className="relative pt-10 sm:pt-14 md:pt-18 lg:pt-19 pb-0 sm:pb-4 md-pb-5 lg:pb-7 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        
          <div className="text-center space-y-3 md:space-y-4 ">
            <p className="text-xs md:text-sm text-gray-500">
              Trusted by security teams worldwide
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-10 pb-4 sm:pb-6 md:pb-8 font-Inter font-semibold">
              {[
                { name: "Microsoft", color: "text-black/50" },
                { name: "Google", color: "text-black/50" },
                { name: "IBM", color: "text-black/50" },
                { name: "Intel", color: "text-black/50" },
                { name: "Deloitte", color: "text-black/50" },
              ].map((company) => (
                <div
                  key={company.name}
                  className={`flex items-center gap-1.5 md:gap-2 text-sm md:text-lg font-semibold ${company.color} hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <span className="text-xs md:text-base">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

         <div className="flex justify-center">
          <div className="w-6/12 h-px bg-gray-200" />
        </div>

 <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {stats.map((item, index) => (
      <div
        key={index}
        className="
          flex items-center gap-2
          rounded-xl border border-gray-200 bg-white
          px-3 py-3
          shadow-sm
        "
      >
        <div className="shrink-0 scale-75 sm:scale-90">
          {item.icon}
        </div>

        <div>
          <h2
            className={`
              text-lg sm:text-2xl lg:text-3xl
              font-bold leading-none
              ${item.color}
            `}
          >
            {item.head}
          </h2>

          <p
            className="
              mt-1
              text-[10px] sm:text-xs lg:text-sm
              text-gray-500
              leading-tight
            "
          >
            {item.sub}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

        <div className="py-[15px] sm:py-[16px] md:py-[32px] lg:py-[46px]">
        <div className="text-center sm:mb-12 md:mb-16 px-2 ">
          <div className="inline-flex items-center justify-center px-3 sm:px-4 py-[2px] sm:py-[4px] rounded-xl border border-[#A14FFC85] bg-[#A14FFC26] backdrop-blur-md text-[#AF7BFD] mt-0 md:mt-3 lg:mt-5">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] text-[#645A7D] font-semibold whitespace-nowrap">
              RATED 5.0/5 • NEXT-GEN SECURITY
            </span>
          </div>

          <h2 className="mt-4 sm:mt-15 mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-Inter text-gray-900 mt-0 sm:mt-2 md:mt-4 lg:mt-5 mb-4 sm:mb-6">
            Why Choose{' '}
            <span className="text-[#AF7BFD]  ">
              Kyberra
            </span>
          </h2>
            <p className="text-[12px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-[20px] font-Inter font-medium text-[#4A4A4A] max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            Experience a mail platform where security is reactive. If threats are detected, 
            your messages instantly re-encrypt to prevent unauthorized access.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 px-2 sm:px-0 mt-4 sm:mt-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
             className="group relative p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl bg-white border border-gray-200 hover:border-[#A855F7] shadow-md sm:shadow-lg hover:shadow-[0_0_30px_#AF7BFD66] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg md:rounded-xl blur-sm md:blur-lg transition-opacity duration-300 group-hover:opacity-20" 
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className={`relative inline-flex p-2 sm:p-2.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r ${feature.gradient}`}>
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              {/* <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" /> */}
            </div>
          ))}
        </div>



<div className="rounded-2xl sm:rounded-3xl border border-[#A14FFC85] bg-[#F6F0FF] 
                p-4 sm:p-5 md:p-6 lg:p-8">
                
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
    
    {ENTERPRISE_FEATURES.map((feature, index) => (
      <div
        key={index}
        className="
          flex items-start gap-3 sm:gap-4
          rounded-xl
          transition-all duration-300
        "
      >
        
        {/* Icon */}
        <div
          className="
            flex items-center justify-center
            h-12 w-12 sm:h-14 sm:w-14
            rounded-xl sm:rounded-2xl
            border border-[#A14FFC85]
            bg-white shadow-sm
            shrink-0
          "
        >
          <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#AF7BFD]" />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <h3
            className="
              text-sm sm:text-base lg:text-lg
              font-semibold text-[#111827]
              leading-snug
            "
          >
            {feature.title}
          </h3>

          <p
            className="
              mt-1
              text-xs sm:text-sm lg:text-base
              leading-relaxed
              text-[#4b5563]
            "
          >
            {feature.value}
          </p>
        </div>
      </div>
    ))}
    
  </div>
</div>
       
        {/* Security Standards */}
        {/* <div className="text-center px-2 sm:px-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
            Industry-Leading Security Standards
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
            {[
              { label: "AES-256", desc: "Encryption" },
              { label: "RSA-4096", desc: "Key Exchange" },
              { label: "Perfect Forward Secrecy", desc: "PFS Enabled" },
              { label: "Zero-Knowledge", desc: "Architecture" },
            ].map((standard, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg md:rounded-xl bg-white border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {standard.label}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  {standard.desc}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Bottom CTA */}
        {/* <div className="mt-12 sm:mt-16 md:mt-20 text-center px-2 sm:px-0">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border border-blue-100 w-full max-w-2xl mx-auto">
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Ready to secure your communications?
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Join 2M+ users who trust their privacy to SecureMail.
              </p>
            </div>
            <button type="button" onClick={() => navigate('/signup')} className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 text-sm sm:text-base whitespace-nowrap">
              Get Started Free
            </button>
          </div>
        </div> */}
        </div>
      </div>
    </section>
  );
};

export default Features;