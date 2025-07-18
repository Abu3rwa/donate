import React, { useState, useEffect } from "react";
import {
  Typography,
  Link as MuiLink,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getOrgInfo } from "../../services/orgInfoService";

const links = [
  { label: "عن الجمعية", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "تبرع الآن", href: "/donate" },
];

const HomeFooter = () => {
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      setLoading(true);
      try {
        const info = await getOrgInfo();
        setOrgInfo(info || {});
      } catch (e) {
        setOrgInfo({});
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  if (loading) {
    return (
      <footer className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 mt-10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const orgName = orgInfo?.name || "جمعية السعاتة الدومة الخيرية";
  const orgLongName = orgInfo?.longName || "";
  const year = new Date().getFullYear();
  const socials = orgInfo?.social || [];
  const emails = orgInfo?.contacts?.emails || [];
  const phones = orgInfo?.contacts?.phones || [];
  const description = orgInfo?.description;
  const logo = orgInfo?.logo;

  return (
    <footer
      className="w-full border-t mt-10"
      style={{
        background:
          "linear-gradient(135deg, #0e374e 0%, #0ea5e9 60%, #10b981 100%)", // darker blue-green
        color: "#fff",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              {logo && (
                <img
                  src={logo}
                  alt={`${orgName} logo`}
                  className="w-12 h-12 rounded-lg shadow-sm"
                />
              )}
              <div>
                <Typography variant="h5" className="font-bold text-white mb-1">
                  {orgName}
                </Typography>
                {orgLongName && (
                  <Typography variant="body2" className="text-white">
                    {orgLongName}
                  </Typography>
                )}
              </div>
            </div>

            {description && (
              <Typography variant="body2" className="text-white">
                {description}
              </Typography>
            )}

            {/* Social Media */}
            {socials.length > 0 && (
              <div className="pt-4">
                <Typography
                  variant="subtitle2"
                  className="font-semibold text-white mb-3"
                >
                  تابعنا على وسائل التواصل
                </Typography>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s, idx) => {
                    let icon = null;
                    let iconColor = undefined;

                    if (s.url.includes("facebook.com")) {
                      icon = (
                        <FacebookIcon
                          fontSize="small"
                          style={{ color: "#1877F3" }}
                        />
                      );
                      iconColor = "#1877F3";
                    } else if (s.url.includes("wa.me")) {
                      icon = (
                        <WhatsAppIcon
                          fontSize="small"
                          style={{ color: "#25D366" }}
                        />
                      );
                      iconColor = "#25D366";
                    } else if (s.url.startsWith("http")) {
                      icon = (
                        <LanguageIcon
                          fontSize="small"
                          style={{ color: "#06b6d4" }}
                        />
                      );
                      iconColor = "#06b6d4";
                    }

                    if (!icon) return null;

                    return (
                      <MuiLink
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm font-medium bg-white/10 text-white/80 underline"
                        aria-label={s.name || "رابط اجتماعي"}
                        underline="always"
                      >
                        {icon}
                        <span className="text-sm font-medium">{s.name}</span>
                      </MuiLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <Typography
              variant="subtitle2"
              className="font-semibold text-white mb-3"
            >
              روابط سريعة
            </Typography>
            <nav className="flex flex-col space-y-2">
              {links.map((link) => (
                <MuiLink
                  key={link.href}
                  href={link.href}
                  underline="always"
                  className="text-white/80 underline font-medium py-1"
                >
                  {link.label}
                </MuiLink>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <Typography
              variant="subtitle2"
              className="font-semibold text-white mb-3"
            >
              معلومات التواصل
            </Typography>
            <div className="space-y-3">
              {emails.length > 0 && (
                <MuiLink
                  href={`mailto:${emails[0]}`}
                  className="flex items-center gap-3 text-white/80 underline font-medium group"
                  underline="always"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <EmailIcon fontSize="small" className="text-white" />
                  </div>
                  <span className="text-sm">{emails[0]}</span>
                </MuiLink>
              )}

              {phones.length > 0 && (
                <MuiLink
                  href={`tel:${phones[0]}`}
                  className="flex items-center gap-3 text-white/80 underline font-medium group"
                  underline="always"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <PhoneIcon fontSize="small" className="text-white" />
                  </div>
                  <span
                    dir="ltr"
                    className="text-sm font-mono"
                    style={{
                      direction: "ltr",
                      unicodeBidi: "isolate",
                    }}
                  >
                    {phones[0]}
                  </span>
                </MuiLink>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <Divider className="my-8 bg-white/20" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Typography
            variant="body2"
            className="text-white text-center sm:text-left"
          >
            © {year} {orgName}. جميع الحقوق محفوظة.
          </Typography>

          <div className="flex items-center gap-4 text-white text-sm">
            <MuiLink
              href="/privacy"
              className="text-white/80 underline"
              underline="always"
            >
              سياسة الخصوصية
            </MuiLink>
            <span>•</span>
            <MuiLink
              href="/terms"
              className="text-white/80 underline"
              underline="always"
            >
              شروط الاستخدام
            </MuiLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
