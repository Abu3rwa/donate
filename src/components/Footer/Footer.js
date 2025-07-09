import React from "react";
import { Typography, useTheme } from '@mui/material';
import logo from '../../assets/tempLogo.png';
// Using <a> tags for standalone demo instead of <Link> from react-router-dom
// import { Link } from "react-router-dom";

// --- SVG ICONS ---
// Self-contained SVG components for icons to avoid external dependencies.
const MailIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const PhoneIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MapPinIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const FacebookIcon = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);


// --- REUSABLE FOOTER SUB-COMPONENTS ---

const FooterSection = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{title}</h3>
        <div className="mt-4 space-y-4">
            {children}
        </div>
    </div>
);

const FooterLink = ({ href, children }) => (
    <a href={href} className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200">
        {children}
    </a>
);

const ContactInfo = ({ icon, children }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 text-gray-400">{icon}</div>
        <div className="text-base text-gray-500 dark:text-gray-300">{children}</div>
    </div>
);

const SocialLink = ({ href, icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-white">
        <span className="sr-only">{label}</span>
        {icon}
    </a>
);

// --- MAIN FOOTER COMPONENT ---

const Footer = () => {
  const currentYear = new Date().getFullYear();
    const theme = useTheme();

  return (
        <footer className="bg-white dark:bg-gray-900" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="pb-8 xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* About Section */}
                    <div className="space-y-8 xl:col-span-1">
                        <div className="flex items-center">
                            <img
                              src={logo}
                              alt="شعار الجمعية"
                              className="w-12 h-12 rounded-lg object-cover object-center mr-3"
                            />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                              جمعية السعاتة الدومة الخيرية
                            </Typography>
              </div>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          نحن منظمة خيرية غير ربحية مكرسة لتقديم الدعم والإغاثة لأهالي منطقة السعاتة الدومة من خلال مشاريع مستدامة ومبادرات مجتمعية.
                        </Typography>
                        
        </div>

                    {/* Links & Contact Grid */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                       
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                           <div>
                                <FooterSection title="تواصل معنا">
                                    <ContactInfo icon={<MapPinIcon />}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                          السعاتة الدومة،<br/>
                                          غرب كردفان، السودان
                                        </Typography>
                                    </ContactInfo>
                                    <ContactInfo icon={<PhoneIcon />}>
                                        <a href="tel:+249123456789" className="hover:text-gray-900 dark:hover:text-white">
                                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            +249 123 456 789
                                          </Typography>
                                        </a>
                                    </ContactInfo>
                                    <ContactInfo icon={<MailIcon />}>
                                        <a href="mailto:info@saata.org" className="hover:text-gray-900 dark:hover:text-white">
                                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            info@saata.org
                                          </Typography>
                                        </a>
                                    </ContactInfo>
                                </FooterSection>
                           </div>
              </div>
            </div>
          </div>

                {/* Copyright Bar */}
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
                    <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                      &copy; {currentYear} جمعية السعاتة الدومة الخيرية. جميع الحقوق محفوظة.
                    </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
