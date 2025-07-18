import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampaignById } from "../../services/compaignService";
import { getDonationsForCampaign } from "../../services/donationsService";
import DonationModal from "../visitor-donations-page/DonationModal";
import formatShortNumberAr from "../../helpers/formatShortNumberAr";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  STATUS_LABELS_AR,
  CATEGORY_LABELS_AR,
} from "../../helpers/compaignLabelsAr";
import { updateCampaign } from "../../services/compaignService";

function isUpcoming(startDate) {
  if (!startDate) return false;
  const today = new Date();
  const start = new Date(startDate);
  // Ignore time, compare only date
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return start > today;
}
function isToday(startDate) {
  if (!startDate) return false;
  const today = new Date();
  const start = new Date(startDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return start.getTime() === today.getTime();
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [raised, setRaised] = useState(0);
  const [donateOpen, setDonateOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const c = await getCampaignById(id);
        setCampaign(c);
        setStatus(c.status);
        // Auto-activate if today >= startDate and status is 'upcoming'
        if (c.startDate && c.status === "upcoming") {
          const today = new Date();
          const start = new Date(c.startDate);
          today.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          if (start <= today) {
            await updateCampaign(id, { status: "active" });
            setStatus("active");
          }
        }
        const donations = await getDonationsForCampaign(id);
        const total = donations
          .filter((d) => d.status === "completed")
          .reduce((sum, d) => sum + (d.amount || 0), 0);
        setRaised(total);
      } catch (e) {
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">جاري تحميل تفاصيل الحملة...</div>;
  }
  if (!campaign) {
    return (
      <div className="text-center p-8 text-red-600">
        تعذر العثور على الحملة.
      </div>
    );
  }

  // Social share URLs
  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`تبرع لحملة: ${campaign.name}`);

  const upcoming = campaign && isUpcoming(campaign.startDate);
  const todayIsStart = campaign && isToday(campaign.startDate);

  return (
    <main
      className="min-h-screen bg-[var(--background-color)] py-6 px-2"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            {/* Category Badge */}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              {CATEGORY_LABELS_AR[campaign.category] ||
                campaign.category ||
                "حملة"}
            </span>
            {/* Status Badge */}
            {upcoming ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800 animate-pulse">
                قريبًا
              </span>
            ) : todayIsStart ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800">
                بدأت
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {STATUS_LABELS_AR[status || campaign.status] ||
                  status ||
                  campaign.status ||
                  "نشطة"}
              </span>
            )}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-right text-green-700"
            style={{ fontFamily: "Tajawal, Cairo, sans-serif" }}
          >
            {campaign.name}
          </h1>
        </div>
        {/* Main Image & Gallery */}
        <div className="mb-4">
          <img
            src={campaign.image}
            alt={campaign.name}
            className="w-full rounded-xl object-cover aspect-[16/9] bg-gray-100 cursor-pointer"
            onClick={() => {
              setGalleryIndex(0);
              setGalleryOpen(true);
            }}
          />
          {/* Gallery Thumbnails */}
          {campaign.gallery &&
            Array.isArray(campaign.gallery) &&
            campaign.gallery.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {campaign.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={campaign.name + " معرض الصور"}
                    className={`h-16 w-24 object-cover rounded cursor-pointer border-2 ${
                      galleryIndex === i + 1
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setGalleryIndex(i + 1);
                      setGalleryOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          {/* Gallery Modal */}
          <Dialog
            open={galleryOpen}
            onClose={() => setGalleryOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <div className="relative bg-black">
              <IconButton
                aria-label="إغلاق"
                onClick={() => setGalleryOpen(false)}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 8,
                  color: "#fff",
                  zIndex: 10,
                }}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={
                  galleryIndex === 0
                    ? campaign.image
                    : campaign.gallery[galleryIndex - 1]
                }
                alt="صورة الحملة"
                className="w-full max-h-[80vh] object-contain mx-auto"
              />
              <div className="flex gap-2 justify-center mt-2 mb-4 bg-black/60 p-2 rounded-b-xl">
                <img
                  src={campaign.image}
                  alt="صورة رئيسية"
                  className={`h-12 w-20 object-cover rounded cursor-pointer border-2 ${
                    galleryIndex === 0
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setGalleryIndex(0)}
                />
                {campaign.gallery &&
                  campaign.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={campaign.name + " معرض الصور مصغرة"}
                      className={`h-12 w-20 object-cover rounded cursor-pointer border-2 ${
                        galleryIndex === i + 1
                          ? "border-green-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setGalleryIndex(i + 1)}
                    />
                  ))}
              </div>
            </div>
          </Dialog>
        </div>
        {/* Key Info Section */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-700">
          {/* Tags */}
          {campaign.tags &&
            campaign.tags.split(",").map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold"
              >
                {tag.trim()}
              </span>
            ))}
          {/* Region */}
          {campaign.region && (
            <span className="flex items-center gap-1">
              <LocationOnIcon fontSize="small" /> {campaign.region}
            </span>
          )}
          {/* Beneficiaries */}
          {campaign.beneficiaries && (
            <span className="flex items-center gap-1">
              <GroupsIcon fontSize="small" /> عدد المستفيدين:{" "}
              {campaign.beneficiaries}
            </span>
          )}
          {/* Dates */}
          {campaign.startDate && (
            <span className="flex items-center gap-1">
              <CalendarMonthIcon fontSize="small" /> يبدأ: {campaign.startDate}
            </span>
          )}
          {campaign.endDate && (
            <span className="flex items-center gap-1">
              <CalendarMonthIcon fontSize="small" /> ينتهي: {campaign.endDate}
            </span>
          )}
        </div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="donate-progress-bar-wrap">
            <div
              className="donate-progress-bar"
              style={{
                width: `${Math.min(
                  100,
                  (raised / (campaign.goal || 1)) * 100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>
              {Math.round(Math.min(100, (raised / (campaign.goal || 1)) * 100))}
              %
            </span>
            <span>
              <span className="font-bold text-green-700">
                {formatShortNumberAr(raised)}
              </span>
              <span className="text-gray-500 font-normal">
                {" / " + formatShortNumberAr(campaign.goal || 0)}{" "}
                {campaign.currency || ""}
              </span>
            </span>
          </div>
        </div>
        {/* Description (expandable) */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-green-700">وصف الحملة</h2>
          <p
            className={`text-gray-800 leading-relaxed ${
              !descExpanded &&
              campaign.description &&
              campaign.description.length > 300
                ? "line-clamp-5"
                : ""
            }`}
            style={{ whiteSpace: "pre-line" }}
          >
            {campaign.description}
          </p>
          {campaign.description && campaign.description.length > 300 && (
            <button
              className="text-blue-600 font-bold mt-2 hover:underline"
              onClick={() => setDescExpanded((v) => !v)}
            >
              {descExpanded ? "إخفاء" : "عرض المزيد"}
            </button>
          )}
        </div>
        {/* Documents */}
        {campaign.documents &&
          Array.isArray(campaign.documents) &&
          campaign.documents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-green-700">
                مستندات الحملة
              </h3>
              <ul className="space-y-2">
                {campaign.documents.map((docUrl, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <InsertDriveFileIcon className="text-blue-500" />
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      تحميل المستند {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        {/* Updates/Progress Posts */}
        {campaign.progressUpdates && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-green-700">
              تحديثات الحملة
            </h3>
            <ul className="space-y-2 border-r-2 border-green-200 pr-4">
              {campaign.progressUpdates.split("\n").map((update, i) => (
                <li key={i} className="relative pl-4">
                  <span className="absolute right-[-1.1rem] top-1.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  <span className="text-gray-700">{update}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Contact Info */}
        {campaign.contactInfo && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-green-700">
              معلومات التواصل
            </h3>
            <div className="text-gray-700 text-sm bg-blue-50 rounded-lg p-3">
              {campaign.contactInfo}
            </div>
          </div>
        )}
        {/* Social Sharing */}
        <div className="mb-6 flex gap-3 items-center justify-center">
          <span className="text-gray-600 font-bold">شارك الحملة:</span>
          <a
            href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاركة عبر واتساب"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition"
          >
            <WhatsAppIcon />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاركة عبر تويتر"
            className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2 transition"
          >
            <TwitterIcon />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاركة عبر فيسبوك"
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 transition"
          >
            <FacebookIcon />
          </a>
        </div>
        {/* Donate Button */}
        <div className="flex flex-col justify-evenly items-center mb-4 sticky bottom-0 bg-white z-10 py-4">
          {upcoming && (
            <div className="text-center text-md text-yellow-700 mt-1 font-bold animate-pulse ">
              التبرع متاح عند بدء الحملة
            </div>
          )}
          <button
            className={`bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-3 mt-3  px-8 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
              upcoming
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-cyan-500 transform hover:scale-[1.02]"
            }`}
            onClick={() => {
              if (!upcoming) setDonateOpen(true);
            }}
            disabled={upcoming}
            title={
              upcoming ? "الحملة لم تبدأ بعد. التبرع متاح عند الانطلاق." : ""
            }
          >
            {upcoming ? "قريبًا" : "تبرع لهذه الحملة"}
          </button>
        </div>
        <DonationModal
          open={donateOpen}
          onClose={() => setDonateOpen(false)}
          onSubmit={() => setDonateOpen(false)}
          campaign={campaign}
        />
      </div>
    </main>
  );
}
