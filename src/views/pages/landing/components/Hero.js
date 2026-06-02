import React from 'react';
import { Star } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
} from 'framer-motion';

import kyberra from '../../../../assets/images/Kyberra.png';

const Hero = () => {

  const { scrollY } = useScroll();

  /* ---------------- Smooth Scroll Physics ---------------- */

  // Raw transforms
  const rawY = useTransform(scrollY, [0, 450], [-20, 0]);

  const rawRotateX = useTransform(scrollY, [0, 450], [12, 0]);

  const rawRotateZ = useTransform(scrollY, [0, 450], [0, 0]);

  const rawScale = useTransform(scrollY, [0, 450], [0.96, 1]);

  const rawZ = useTransform(scrollY, [0, 450], [-120, 0]);

  // Smooth spring animations
  const imageY = useSpring(rawY, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  const imageRotateX = useSpring(rawRotateX, {
    stiffness: 90,
    damping: 24,
  });

  const imageRotateZ = useSpring(rawRotateZ, {
    stiffness: 90,
    damping: 24,
  });

  const imageScale = useSpring(rawScale, {
    stiffness: 90,
    damping: 24,
  });

  const imageZ = useSpring(rawZ, {
    stiffness: 90,
    damping: 24,
  });

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(116.78deg,_#1A0B2E_0%,_#3B0764_100%)] pb-4">

      {/* Main Content */}
      <section className="relative flex items-start sm:items-center justify-center px-4 sm:px-6 lg:px-8 pt-[16px] md:pt-[20px] pb-0 [perspective:1800px]">

        <div className="max-w-7xl mx-auto w-full">

          <div className="space-y-3 sm:space-y-6 md:space-y-8 px-2 sm:px-0">

            {/* Trust Badge */}
            <div className="flex justify-center pt-0 sm:pt-[8px] lg:pt-[35px]">

              <div className="inline-flex items-center justify-center gap-0.5 sm:gap-1 rounded-full border border-[#A14FFC85] bg-[#A14FFC26] backdrop-blur-md px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 min-w-[160px] sm:min-w-[220px] md:min-w-[283px]">

                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <div className="hidden sm:block h-3 w-px bg-white/20" />

                <span className="text-[8px] sm:text-[10px] md:text-[12px] font-semibold text-white whitespace-nowrap">
                  RATED 5.0/5 • NEXT-GEN SECURITY
                </span>

              </div>

            </div>

            {/* Headline */}
            <div className="text-center">

              <h1 className="font-extrabold leading-[1.15] sm:leading-[1.1] md:leading-[1.05] text-[28px] sm:text-[44px] md:text-[59px] lg:text-[70px]">

                <span className="block text-white my-[8px] md:my-[13px] lg:my-[14px]">
                  The Next Generation
                </span>

                <span className="block -mt-0.5 sm:-mt-1 md:-mt-2 text-[#AF7BFD]">
                  Of Condition Based Private
                  <br className="hidden sm:block" />
                  <span className="block sm:inline">Messaging</span>
                </span>

              </h1>

            </div>

            {/* Subtitle */}
            <p className="mx-auto max-w-3xl px-3 sm:px-4 text-center text-[11px] sm:text-sm md:text-base lg:text-lg font-light leading-relaxed text-white">
              Experience a mail platform where security is reactive.
              If threats are detected, your messages instantly re-encrypt
              to prevent unauthorized access.
            </p>

            {/* Desktop Image */}
            <motion.div
              style={{
                y: imageY,
                scale: imageScale,
              }}
                className="
                hidden md:flex
                justify-center
                relative
                will-change-transform
                transform-gpu
              "
            >
              <div className="relative">
                {/* Cinematic Bottom Fade */}
                <div
                  className="
                  
                    absolute
                    bottom-[-100px]
                    left-0
                    w-full
                    h-[100px]
                    bg-gradient-to-b
                    from-transparent
                    via-[#1A0B2E]/70
                    to-[#1A0B2E]
                    blur-3xl
                    opacity-80
                    pointer-events-none
                    z-20
                  "
                />
                <motion.img
                  src={kyberra}
                  alt="kyberra"
                  style={{
                    transform: useMotionTemplate`
                      perspective(1000px)
                      translateZ(${imageZ}px)
                      rotateX(${imageRotateX}deg)
                      rotateZ(${imageRotateZ}deg)
                    `,
                    transformStyle: 'preserve-3d',
                  }}
                 className="
                  relative
                  z-10
                  rounded-[28px]
                  mb-[-400px]
                  md:mb-[-340px]
                  w-[500px]
                  md:w-[760px]
                  lg:w-[900px]
                  xl:w-[1060px]
                  h-auto
                  object-contain
                  shadow-[0_60px_140px_rgba(0,0,0,0.65)]
                  will-change-transform
                "
                />
              </div>
            </motion.div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Hero;