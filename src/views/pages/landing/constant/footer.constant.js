 import { 
  Shield, 
  Globe, 
  Twitter, 
  Github, 
  Linkedin, 

  Award,

  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
 
 export const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Security", href: "/security" },
        { label: "Enterprise", href: "/enterprise" },
        { label: "Mobile Apps", href: "/apps" },
        { label: "Status", href: "/status" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Partners", href: "/partners" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "Community", href: "/community" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" }
      ]
    },
    {
      title: "Developers",
      links: [
        { label: "API Documentation", href: "/api" },
        { label: "Open Source", href: "/opensource" },
        { label: "Security Research", href: "/security-research" },
        { label: "Bug Bounty", href: "/bug-bounty" },
        { label: "SDKs & Libraries", href: "/sdk" },
        { label: "Integrations", href: "/integrations" }
      ]
    }
  ];

 export const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/securemail" },
    { icon: Github, label: "GitHub", href: "https://github.com/securemail" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/securemail" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/securemail" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/securemail" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com/securemail" }
  ];

 export const certifications = [
    { label: "GDPR Compliant", icon: Shield },
    { label: "ISO 27001", icon: Award },
    { label: "Swiss Privacy", icon: Globe },
    { label: "Open Source", icon: Github }
  ];