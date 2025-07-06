import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { CATEGORIES_AR } from "../constants";

// Import images
import image1 from "../assets/468500003_8770164286397663_795409730327188365_n.jpg";
import image2 from "../assets/468742514_8766108773469881_4524514268323846924_n.jpg";
import image3 from "../assets/481988533_9306874889393264_3406120898396487537_n.jpg";
import image4 from "../assets/475801362_1675287210537054_7479658673602311601_n.jpg";
import image5 from "../assets/488256335_9483793145034770_3893820036335481734_n.jpg";
import image6 from "../assets/488612872_4083956205257510_1041545498427009329_n.jpg";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate stories data with real images
  useEffect(() => {
    const mockStories = [
      {
        id: 1,
        title: "قصة أمينة: من اليأس إلى الأمل",
        excerpt:
          "كيف ساعدت التبرعات أمينة في إعادة بناء حياتها بعد فقدان منزلها في الفيضانات. أمينة أم لثلاثة أطفال كانت تعيش في منزل بسيط في السعاتة الدومة عندما ضربت الفيضانات المنطقة.",
        content:
          "قصة أمينة هي قصة إرادة وتحدي. بعد أن فقدت منزلها في الفيضانات، وجدت نفسها بلا مأوى مع أطفالها الثلاثة. لكن بفضل تبرعاتكم الكريمة، استطعنا مساعدتها في إعادة بناء حياتها.",
        image: image1,
        category: "emergency",
        author: "فريق العمل الميداني",
        publishedAt: new Date("2024-01-15"),
        viewCount: 1250,
        likes: 89,
        tags: ["إغاثة طارئة", "إعادة بناء", "أسر محتاجة"],
        featured: true,
      },
      {
        id: 2,
        title: "مدرسة الأمل الجديدة",
        excerpt:
          "بناء مدرسة جديدة في السعاتة الدومة لتعليم 200 طفل محروم من التعليم. المدرسة توفر التعليم الأساسي للأطفال في المنطقة.",
        content:
          "مدرسة الأمل الجديدة هي مشروع طموح يهدف إلى توفير التعليم الجيد للأطفال في منطقة السعاتة الدومة. المدرسة مجهزة بأحدث التقنيات التعليمية وتضم معلمين مؤهلين.",
        image: image2,
        category: "education",
        author: "فريق التعليم",
        publishedAt: new Date("2024-01-10"),
        viewCount: 980,
        likes: 67,
        tags: ["تعليم", "مدرسة", "أطفال"],
        featured: true,
      },
      {
        id: 3,
        title: "عيادة صحية متنقلة",
        excerpt:
          "توفير الرعاية الصحية الأساسية لأكثر من 500 أسرة في المناطق النائية. العيادة المتنقلة تجوب المنطقة لتقديم الخدمات الطبية.",
        content:
          "العيادة الصحية المتنقلة هي مشروع رائد يهدف إلى توفير الرعاية الصحية الأساسية للأسر في المناطق النائية من السعاتة الدومة.",
        image: image3,
        category: "healthcare",
        author: "فريق الصحة",
        publishedAt: new Date("2024-01-05"),
        viewCount: 756,
        likes: 45,
        tags: ["صحة", "عيادة", "رعاية طبية"],
        featured: false,
      },
      {
        id: 4,
        title: "مشروع المياه النظيفة",
        excerpt:
          "حفر آبار جديدة وتوفير المياه النظيفة لـ 300 أسرة في السعاتة الدومة. المشروع يضمن وصول المياه النظيفة للجميع.",
        content:
          "مشروع المياه النظيفة يهدف إلى توفير المياه النظيفة والصالحة للشرب لجميع الأسر في منطقة السعاتة الدومة.",
        image: image4,
        category: "water",
        author: "فريق المياه",
        publishedAt: new Date("2024-01-01"),
        viewCount: 1120,
        likes: 78,
        tags: ["مياه", "آبار", "صحة"],
        featured: true,
      },
      {
        id: 5,
        title: "مشروع الأمن الغذائي",
        excerpt:
          "توزيع المواد الغذائية الأساسية على الأسر المحتاجة في السعاتة الدومة. المشروع يضمن عدم الجوع لأي أسرة.",
        content:
          "مشروع الأمن الغذائي يهدف إلى توفير المواد الغذائية الأساسية للأسر المحتاجة في منطقة السعاتة الدومة.",
        image: image5,
        category: "food",
        author: "فريق الأمن الغذائي",
        publishedAt: new Date("2023-12-25"),
        viewCount: 890,
        likes: 56,
        tags: ["غذاء", "أمن غذائي", "توزيع"],
        featured: false,
      },
      {
        id: 6,
        title: "مشروع المأوى الطارئ",
        excerpt:
          "بناء مأوى طارئ للأسر التي فقدت منازلها في الكوارث الطبيعية. المشروع يوفر مأوى مؤقت وآمن.",
        content:
          "مشروع المأوى الطارئ يهدف إلى توفير مأوى مؤقت وآمن للأسر التي فقدت منازلها في الكوارث الطبيعية.",
        image: image6,
        category: "shelter",
        author: "فريق الإسكان",
        publishedAt: new Date("2023-12-20"),
        viewCount: 650,
        likes: 34,
        tags: ["مأوى", "إسكان", "طوارئ"],
        featured: false,
      },
    ];

    setStories(mockStories);
    setFilteredStories(mockStories);
    setLoading(false);
  }, []);

  // Filter stories based on category and search
  useEffect(() => {
    let filtered = stories;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (story) => story.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredStories(filtered);
  }, [stories, selectedCategory, searchQuery]);

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p style={{ color: "var(--text-secondary)" }}>جاري تحميل القصص...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section
        style={{
          background: "var(--primary-color)",
          color: "#fff",
          padding: "4rem 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            قصص التأثير
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            قصص حقيقية عن التغيير الإيجابي في حياة أهالي السعاتة الدومة بفضل
            تبرعاتكم الكريمة
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section
        className="py-8"
        style={{
          background: "var(--paper-color)",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                جميع القصص
              </button>
              {Object.entries(CATEGORIES_AR).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === key
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في القصص..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white w-64"
                dir="rtl"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                لا توجد قصص
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                لم يتم العثور على قصص تطابق معايير البحث.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Story Image */}
                  <div className="relative h-48">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    {story.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          مميز
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          story.category === "emergency"
                            ? "bg-red-500 text-white"
                            : story.category === "education"
                            ? "bg-blue-500 text-white"
                            : story.category === "healthcare"
                            ? "bg-green-500 text-white"
                            : story.category === "water"
                            ? "bg-cyan-500 text-white"
                            : story.category === "food"
                            ? "bg-orange-500 text-white"
                            : "bg-purple-500 text-white"
                        }`}
                      >
                        {CATEGORIES_AR[story.category]}
                      </span>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    {/* Story Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{story.publishedAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span>👁️ {story.viewCount}</span>
                        <span>❤️ {story.likes}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Button */}
                    <Link
                      to={`/stories/${story.id}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                    >
                      اقرأ القصة كاملة →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            شارك قصتك معنا
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            هل لديك قصة عن تأثير التبرعات على حياتك أو حياة من حولك؟ شاركها معنا
            لنلهم الآخرين
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            اتصل بنا
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
