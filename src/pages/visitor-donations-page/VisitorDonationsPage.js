import React, { useState, useEffect } from "react";
import "./VisitorDonationsPage.css";
import SearchIcon from "@mui/icons-material/Search";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";

// Mock categories and icons
const CATEGORIES = [
  { key: "sadaqah", label: "صدقة", icon: <VolunteerActivismIcon /> },
  { key: "zakat", label: "زكاة", icon: <MenuBookIcon /> },
  { key: "orphans", label: "الأيتام", icon: <ChildCareIcon /> },
];

// Mock campaigns data
const MOCK_CAMPAIGNS = [
  {
    id: "1",
    title: "مشروع سقيا الماء",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tags: ["صدقة جارية", "داخل السعودية"],
    region: "منطقة مكة",
    beneficiaries: 200,
    raised: 1603,
    goal: 8750,
    category: "sadaqah",
    description: "ساهم في توفير مياه نظيفة للمحتاجين.",
  },
  {
    id: "2",
    title: "كفالة يتيم",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    tags: ["الأيتام", "داخل السعودية"],
    region: "منطقة الرياض",
    beneficiaries: 50,
    raised: 3200,
    goal: 10000,
    category: "orphans",
    description: "ادعم الأيتام وكن سببًا في سعادتهم.",
  },
  {
    id: "3",
    title: "زكاة الفطر",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    tags: ["زكاة", "خارج السعودية"],
    region: "منطقة الشرقية",
    beneficiaries: 120,
    raised: 5000,
    goal: 12000,
    category: "zakat",
    description: "ساهم في إخراج زكاتك لمستحقيها.",
  },
];

function InfoBanner({ category }) {
  const info = {
    sadaqah: {
      title: "صدقة",
      desc: "الصدقة تطفئ الخطيئة وتفتح أبواب الخير. ساهم في مشاريع الصدقة الجارية.",
    },
    zakat: {
      title: "زكاة",
      desc: "الزكاة ركن من أركان الإسلام. ساعدنا في إيصالها لمستحقيها.",
    },
    orphans: {
      title: "الأيتام",
      desc: "كن عونًا للأيتام وادخل السرور على قلوبهم.",
    },
  };
  const { title, desc } = info[category] || info.sadaqah;
  return (
    <div className="info-banner">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function FilterBar({ categories, active, onChange }) {
  return (
    <div className="filter-bar">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className={`filter-btn${active === cat.key ? " active" : ""}`}
          onClick={() => onChange(cat.key)}
        >
          <span className="icon">{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

function CampaignCard({ campaign }) {
  const [amount, setAmount] = useState("");
  const percent = Math.min(
    100,
    Math.round((campaign.raised / campaign.goal) * 100)
  );
  return (
    <div className="campaign-card">
      <div className="card-image">
        <img src={campaign.image} alt={campaign.title} />
      </div>
      <div className="card-content">
        <div className="tags">
          {campaign.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <h4 className="card-title">{campaign.title}</h4>
        <div className="metrics">
          <span>
            <LocationOnIcon /> {campaign.region}
          </span>
          <span>
            <GroupsIcon /> عدد المستفيدين: {campaign.beneficiaries}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: percent + "%" }}></div>
          <span className="progress-text">{percent}%</span>
        </div>
        <div className="amounts">
          <span>
            {campaign.raised.toLocaleString()} /{" "}
            {campaign.goal.toLocaleString()} ر.س
          </span>
        </div>
        <div className="donation-input">
          <label>مبلغ التبرع</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="أدخل المبلغ"
          />
        </div>
      </div>
      <div className="card-footer">
        <button className="donate-btn">تبرع</button>
        <button className="details-btn">التفاصيل</button>
        <button className="cart-btn" title="إضافة للسلة">
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
}

export default function VisitorDonationsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [campaigns, setCampaigns] = useState([]);

  // Simulate Firestore fetch
  useEffect(() => {
    // In real app, fetch from Firestore with filters
    let filtered = MOCK_CAMPAIGNS.filter((c) => c.category === activeCategory);
    if (search) {
      filtered = filtered.filter((c) => c.title.includes(search));
    }
    setCampaigns(filtered);
  }, [activeCategory, search]);

  return (
    <div className="visitor-donations-bg">
      <div className="visitor-donations-container">
        {/* Header */}
        <div className="header-row">
          <h2 className="page-title">فرص التبرع</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="ابحث عن حملة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn">
              <SearchIcon /> بحث
            </button>
          </div>
        </div>
        {/* Filters */}
        <FilterBar
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />
        {/* Info Banner */}
        <InfoBanner category={activeCategory} />
        {/* Campaigns Grid */}
        <div className="campaigns-grid">
          {campaigns.length === 0 ? (
            <div className="no-campaigns">لا توجد حملات متاحة</div>
          ) : (
            campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
          )}
        </div>
      </div>
    </div>
  );
}
