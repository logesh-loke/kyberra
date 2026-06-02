import React from 'react'
import iso from '../../../../assets/images/Iso.png'
import GDPR from '../../../../assets/images/GDPR.jpg'
import ItAct from '../../../../assets/images/it.png'
import DPDP from '../../../../assets/images/DPDP.jpg'
import Nist from '../../../../assets/images/nist.png'
import soc from '../../../../assets/images/soc.jpg'

export const Compliance = () => {

  const COMPLIANCE = [
    {
      title: "GDPR",
      description: "EU Regulation 2016 /679",
      image: GDPR,
    },
    {
      title: "DPDP",
      description: "India Digital Personal Data Protection",
      image: DPDP,
    },
    {
      title: "IT Act 2000 §43A",
      description: "Reasonable Security Practices",
      image: ItAct,
    },
    {
      title: "ISO 27001:2022",
      description: "Information Security Management",
      image: iso,
    },
    {
      title: "SOC 2 Type II",
      description: "Security & Availability Controls",
      image: soc,
    },
    {
      title: "NIST 800-63B",
      description: "Digital Identity Guidelines",
      image: Nist,
    },
  ]

  return (
    <section
      id="Compliance"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-[122px] sm:py-2 lg:py-6 bg-gradient-to-b from-white via-gray-50 to-white"
    >

      <div className="text-center mb-3 pb-2 md:pb-3 lg:pb-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-4">
          Legal & <span className="text-[#AF7BFD]">Compliance</span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Built with industry-standard compliance and security frameworks.
        </p>
      </div>

      <div className="bg-[#A14FFC26] border border-[#A14FFC85] py-4 sm:py-5 md:py-6 px-4 sm:px-6 rounded-xl sm:rounded-2xl">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

            {COMPLIANCE.map((compliance, index) => {

              return (
                <div
                  key={index}
                  className="group relative p-3 sm:p-4 md:p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(161,79,252,0.15)] hover:border-[#A855F7] hover:bg-white/15 hover:shadow-[0_0_35px_#AF7BFD55] transition-all duration-300 hover:-translate-y-1"
                >

                  <div className="flex items-start gap-4">

                    {/* image */}
                  <div className="relative inline-flex items-center justify-center p-3 rounded-xl bg-white border-2 border-[#F6F0FF] shadow-md min-w-[72px] h-[72px]">
                    <img
                      src={compliance.image}
                      alt={compliance.title}
                      className="w-14 h-14 object-contain rounded-md"
                     />
                   </div>

                    <div className="col-span-2">

                      {/* heading */}
                      <h2 className="text-base sm:text-lg font-bold text-black">
                        {compliance.title}
                      </h2>

                      {/* description */}
                      <p className="text-sm flex text-gray-600 leading-relaxed">
                        {compliance.description}
                      </p>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        </div>
      </div>

    </section>
  )
}

export default Compliance