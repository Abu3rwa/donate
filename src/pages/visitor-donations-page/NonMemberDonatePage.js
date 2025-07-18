import React, { useState, useEffect } from "react";
import {
  getAllCampaigns,
  updateCampaign,
} from "../../services/compaignService";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PaidIcon from "@mui/icons-material/Paid";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import "./NonMemberDonatePage.css";
import DonationModal from "./DonationModal";
import { getDonationsForCampaign } from "../../services/donationsService";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FILTERS = [
  { key: "all", label: "الكل", icon: <InfoOutlinedIcon /> },
  { key: "sadaqah", label: "صدقة", icon: <VolunteerActivismIcon /> },
  { key: "zakat", label: "زكاة", icon: <PaidIcon /> },
  { key: "orphans", label: "الأيتام", icon: <ChildCareIcon /> },
];

const INFO_BANNERS = {
  sadaqah: {
    title: "صدقة",
    desc: "الصدقة تطهر المال وتزيد البركة. شارك في دعم مشاريعنا الخيرية.",
  },
  zakat: {
    title: "زكاة",
    desc: "الزكاة ركن من أركان الإسلام. ساهم في إيصالها لمستحقيها.",
  },
  orphans: {
    title: "الأيتام",
    desc: "ساهم في رعاية الأيتام وتوفير احتياجاتهم الأساسية.",
  },
  all: {
    title: "فرص التبرع",
    desc: "اختر من بين الحملات المتنوعة وادعم الخير حيث شئت.",
  },
};

function formatShortNumberAr(num) {
  if (num == null) return "";
  const absNum = Math.abs(num);
  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " مليار";
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + " مليون";
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + " ألف";
  }
  return num.toLocaleString("ar-EG");
}

function isUpcoming(startDate) {
  if (!startDate) return false;
  const today = new Date();
  const start = new Date(startDate);
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
const CATEGORY_LABELS_AR = {
  sadaqah: "صدقة",
  zakat: "زكاة",
  orphans: "الأيتام",
  other: "أخرى",
};
const STATUS_LABELS_AR = {
  active: "نشطة",
  completed: "مكتملة",
  upcoming: "قادمة",
  archived: "مؤرشفة",
  paused: "متوقفة",
  planning: "قيد التخطيط",
};

export default function NonMemberDonatePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [thankYou, setThankYou] = useState(false);
  const [raisedAmounts, setRaisedAmounts] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const data = await getAllCampaigns();
        setCampaigns(data);
      } catch (err) {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchRaised = async () => {
      const amounts = {};
      for (const c of campaigns) {
        try {
          // Auto-activate if today >= startDate and status is 'upcoming'
          if (c.startDate && c.status === "upcoming") {
            const today = new Date();
            const start = new Date(c.startDate);
            today.setHours(0, 0, 0, 0);
            start.setHours(0, 0, 0, 0);
            if (start <= today) {
              await updateCampaign(c.id, { status: "active" });
              c.status = "active";
            }
          }
          const donations = await getDonationsForCampaign(c.id);
          const total = donations
            .filter((d) => d.status === "completed")
            .reduce((sum, d) => sum + (d.amount || 0), 0);
          amounts[c.id] = total;
        } catch (e) {
          amounts[c.id] = 0;
        }
      }
      setRaisedAmounts(amounts);
    };
    if (campaigns.length > 0) fetchRaised();
  }, [campaigns]);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.category === activeFilter;
    const matchesSearch =
      c.name?.includes(search) || c.description?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const info = INFO_BANNERS[activeFilter] || INFO_BANNERS.all;

  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCampaign(null), 200);
  };
  const handleDonationSubmit = async (data) => {
    setModalOpen(false);
    setThankYou(false);
    // data should include receiptFile if present
    if (data && data.receiptFile) {
      // Show loading or processing state if needed
      setThankYou(false);
      // If no issues, proceed as normal
    }
    setThankYou(true);
    setTimeout(() => setThankYou(false), 4000);
    // TODO: send donation data to backend or show confirmation
  };

  if (thankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-green-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xs p-8 text-center border border-gray-100">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              شكرًا لتبرعك!
            </h2>
            <p className="text-gray-700 mb-4">
              نقدر دعمك لنا. سنتواصل معك قريبًا لإكمال عملية التبرع.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-bg min-h-screen py-6 px-2">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2
            className="text-2xl sm:text-3xl font-bold text-right text-green-700"
            style={{ fontFamily: "Tajawal, Cairo, sans-serif" }}
          >
            فرص التبرع
          </h2>
          <form
            className="flex items-center w-full sm:w-auto max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="ابحث عن حملة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="donate-search-input"
            />
            <button type="submit" className="donate-search-btn">
              <SearchIcon />
            </button>
          </form>
        </div>
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto donate-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`donate-filter-btn${
                activeFilter === f.key ? " active" : ""
              }`}
              onClick={() => setActiveFilter(f.key)}
              type="button"
            >
              {f.icon}
              <span className="ml-1">{f.label}</span>
            </button>
          ))}
        </div>
        {/* Info Banner */}
        <div className="donate-info-banner mb-8">
          <h3 className="font-bold text-lg mb-1">{info.title}</h3>
          <p className="text-sm">{info.desc}</p>
        </div>
        {/* Campaign Grid */}
        {loading ? (
          <div className="text-center p-8">جاري تحميل الحملات...</div>
        ) : (
          <div className="donate-grid">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                لا توجد حملات مطابقة.
              </div>
            ) : (
              filteredCampaigns.map((c) => (
                <div
                  key={c.id}
                  className={`donate-card donate-card-${
                    c.category || "default"
                  }`}
                >
                  <div className="donate-card-img-wrap">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="donate-card-img"
                    />
                  </div>
                  <div className="donate-card-content">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {c.tags &&
                        c.tags.split(",").map((tag, i) => (
                          <span key={i} className="donate-tag">
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                    <h3 className="donate-card-title">{c.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <LocationOnIcon fontSize="small" />
                        {c.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <GroupsIcon fontSize="small" />
                        عدد المستفيدين: {c.beneficiaries}
                      </span>
                      {/* Status/Upcoming Badge */}
                      {isUpcoming(c.startDate) ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800 animate-pulse ml-2">
                          قريبًا
                        </span>
                      ) : isToday(c.startDate) ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800 ml-2">
                          بدأت
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 ml-2">
                          {STATUS_LABELS_AR[c.status] || c.status || "نشطة"}
                        </span>
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="donate-progress-bar-wrap">
                        <div
                          className="donate-progress-bar"
                          style={{
                            width: `${Math.min(
                              100,
                              ((raisedAmounts[c.id] || 0) / (c.goal || 1)) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>
                          {Math.round(
                            Math.min(
                              100,
                              ((raisedAmounts[c.id] || 0) / (c.goal || 1)) * 100
                            )
                          )}
                          %
                        </span>
                        <span>
                          <span className="font-bold text-green-700">
                            {formatShortNumberAr(raisedAmounts[c.id] || 0)}
                          </span>
                          <span className="text-gray-500 font-normal">
                            {" "}
                            / {formatShortNumberAr(c.goal || 0)}{" "}
                            {c.currency || ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Card Footer */}
                  {isUpcoming(c.startDate) && (
                    <div className="text-center text-md text-yellow-700 mt-1 font-bold animate-pulse">
                      التبرع متاح عند بدء الحملة
                    </div>
                  )}
                  <div className="donate-card-footer">
                    <button
                      className={`donate-btn-main${
                        isUpcoming(c.startDate)
                          ? " opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => {
                        if (!isUpcoming(c.startDate)) handleDonateClick(c);
                      }}
                      disabled={isUpcoming(c.startDate)}
                      title={
                        isUpcoming(c.startDate)
                          ? "الحملة لم تبدأ بعد. التبرع متاح عند الانطلاق."
                          : ""
                      }
                    >
                      {isUpcoming(c.startDate) ? "قريبًا" : "تبرع"}
                    </button>
                    <a
                      href={`/compaigns/${c.id}`}
                      className="donate-btn-secondary inline-block text-center"
                      style={{ textDecoration: "none" }}
                    >
                      التفاصيل
                    </a>
                  </div>
                  {c.gallery &&
                    Array.isArray(c.gallery) &&
                    c.gallery.length > 0 && (
                      <GallerySlider images={c.gallery} campaignName={c.name} />
                    )}
                </div>
              ))
            )}
          </div>
        )}
        <DonationModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleDonationSubmit}
          campaign={selectedCampaign}
        />
      </div>
    </div>
  );
}

function GallerySlider({ images, campaignName }) {
  const [current, setCurrent] = React.useState(0);
  const total = images.length;
  if (total === 0) return null;
  const goPrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };
  const goNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };
  return (
    <div className="donate-gallery-slider relative flex items-center justify-center mt-2">
      {total > 1 && (
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100"
          onClick={goPrev}
          title="السابق"
          aria-label="السابق"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
      )}
      <img
        src={images[current]}
        alt={campaignName + " صورة " + (current + 1)}
        className="donate-gallery-img rounded border mx-auto"
        style={{ maxHeight: 120, objectFit: "cover" }}
      />
      {total > 1 && (
        <button
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100"
          onClick={goNext}
          title="التالي"
          aria-label="التالي"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      )}
      {total > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${
                i === current ? "bg-green-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
