import React from 'react';
import { Link } from 'react-router-dom'; // Or next/link for Next.js
import { 
  Shield, 
  Heart,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter
} from 'lucide-react';
import {  socialLinks, certifications } from '../constant/footer.constant'
import logo from 'src/assets/images/kyberraLogo.png';
// import logo from 'src/assets/images/crypsyn-full-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

 

  return (
    <footer className="relative bg-gradient-to-b from-[#1A0B2E] mt-4 to-[#3B0764] border-t border-gray-200">
      {/* Background Pattern - Hidden on mobile */}
      <div className="absolute inset-0 opacity-5 hidden sm:block">
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-5 md:gap-6 mb-2 sm:mb-4 md:mb-5">
            {/* Brand & Description */}
            <div>
              <div className=" sm:gap-3 mb-2 sm:mb-2">
                {/* <div className="p-1.5 sm:p-2 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div> */}
                <img src={logo} alt="crypsyn" className="w-20 sm:w-24 md:w-32 mb-1.5  sm:ml-1 lg:ml-3" />
               
              </div>
              
              <p className="text-[10px] sm:text-[15px] md:text-[16px] lg:text-[18px]  text-white mb-1 sm:mb-2 px-4 max-w-md">
                The world's first adaptive mail platform. We
                believe security shouldn't just be a shield, but an
                intelligent response to your environment.
              </p>
              <div className="flex items-center gap-4 pl-4 pt-2">
                <a
                  href=""
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded  bg-[#27183B] flex items-center justify-center transition hover:scale-105"
                >
                  <Twitter className="w-5 h-5 text-white hover:text-blue-400" />
                </a>

                <a
                  href=""
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded bg-[#27183B] flex items-center justify-center transition hover:scale-105"
                >
                  <Linkedin className="w-5 h-5 text-white hover:text-blue-500" />
                </a>
              </div>
              

              {/* Newsletter */}
              {/* <div className="mb-6 sm:mb-8">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm sm:text-base"
                  />
                  <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-500/30 text-sm sm:text-base whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  We respect your privacy. No spam, ever.
                </p>
              </div> */}

              {/* Social Links */}
              {/* <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Follow Us</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      to={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-1.5 sm:p-2 rounded-lg border border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>


 <div className="block lg:justify-items-end max-w ">
  <h4 className="text-[12px] sm:text-[14px] md:text-[16px] font-semibold text-white mb-4 font-[Space_Grotesk]">
    Company
  </h4>

  <div className="flex block lg:flex-col items-start gap-1 ">
    <a href="#features" className="pr-5 py-1 sm:py-0.5 lg:py-2 rounded-full text-[12px] text-white ">
       Features
    </a>
    <a href="#security" className="pr-5 py-1 sm:py-0.5 lg:py-2 rounded-full text-[12px] text-white">
       Security
    </a>
    <a href="#pricing" className="pr-5 py-1 sm:py-0.5 lg:py-2 rounded-full text-[12px] text-white">
       Pricing
    </a>
      <a href="/blog" className="pr-5 py-1 sm:py-0.5 lg:py-2 rounded-full text-[12px] text-white ">
       Blog
    </a>
  </div>
</div>


          </div>

      

        

          {/* Bottom Bar */}
          <div className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden sm:flex items-center gap-1 text-[#978D9D]">
                  {/* <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" /> */}
                  <span className="text-xs sm:text-sm">© 2024 Kyberra Inc. Made with privacy in mind.</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap justify-center">
                <Link to="/privacy" className="text-xs sm:text-sm text-[#978D9D] ">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-xs sm:text-sm text-[#978D9D]">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-xs sm:text-sm text-[#978D9D]">
                  Cookie Policy
                </Link>
              </div>
            </div>

     

            {/* Back to Top */}
            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
              <a
                href="#top" 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 text-[#978D9D] hover:border-blue-400 hover:text-blue-600 transition-colors text-xs sm:text-sm"
              >
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                Back to top
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 py-2 sm:py-3 md:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
              <div className="text-gray-600 text-center sm:text-left">
                <span className="font-medium">2M+</span> users trust SecureMail worldwide
              </div>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center">
                {/* <span className="text-gray-600">Available in 12 languages</span> */}
                {/* <span className="w-1 h-1 rounded-full bg-gray-400 hidden sm:inline"></span> */}
                <span className="text-gray-600">99.9% uptime</span>
              </div>
              {/* <div className="text-gray-600 text-center sm:text-right">
                Version 4.2.1 • Last updated: March 2024
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;