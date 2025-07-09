import React from "react";
import { Link } from "react-router-dom";


// Import team image
import teamImage from "../../assets/488256335_9483793145034770_3893820036335481734_n.jpg";

const AboutPage = () => {

  const teamMembers = [
    {
      id: 1,
      name: "أحمد محمد",
      role: "المدير التنفيذي",
      bio: "خبرة 15 عام في العمل الخيري والإنساني. قاد العديد من المشاريع الناجحة في السودان.",
      image: teamImage,
    },
    {
      id: 2,
      name: "فاطمة علي",
      role: "مديرة البرامج",
      bio: "متخصصة في إدارة المشاريع الإنسانية مع تركيز على التعليم والصحة.",
      image: teamImage,
    },
    {
      id: 3,
      name: "محمد حسن",
      role: "مدير العمليات الميدانية",
      bio: "يقود الفرق الميدانية ويضمن وصول المساعدات للمحتاجين في المنطقة.",
      image: teamImage,
    },
    {
      id: 4,
      name: "عائشة أحمد",
      role: "مديرة الشؤون المالية",
      bio: "تضمن الشفافية والمحاسبة في جميع العمليات المالية للمنظمة.",
      image: teamImage,
    },
  ];

  const values = [
    {
      title: "الشفافية",
      description:
        "نؤمن بالشفافية الكاملة في جميع عملياتنا ونحاسب أنفسنا أمام المتبرعين والمستفيدين.",
      icon: "🔍",
    },
    {
      title: "العدالة",
      description:
        "نساعد جميع المحتاجين بغض النظر عن العرق أو الدين أو الجنس أو العمر.",
      icon: "⚖️",
    },
    {
      title: "الاستدامة",
      description:
        "نركز على الحلول المستدامة التي تخلق تغييراً طويل الأمد في حياة الناس.",
      icon: "🌱",
    },
    {
      title: "التعاون",
      description: "نعمل مع الشركاء المحليين والدوليين لتحقيق أقصى تأثير ممكن.",
      icon: "🤝",
    },
  ];

  const achievements = [
    {
      year: "2024",
      title: "توسيع نطاق العمل",
      description: "توسيع نطاق عملنا ليشمل 500 أسرة إضافية في السعاتة الدومة.",
    },
    {
      year: "2023",
      title: "مشروع المياه النظيفة",
      description:
        "إنجاز مشروع المياه النظيفة بنجاح وتوفير المياه لـ 300 أسرة.",
    },
    {
      year: "2022",
      title: "تأسيس المنظمة",
      description: "تأسيس المنظمة وبدء العمل في منطقة السعاتة الدومة.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            منظمة خيرية مخصصة لمساعدة أهالي منطقة السعاتة الدومة في الخرطوم،
            السودان
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                مهمتنا ورؤيتنا
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    مهمتنا
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    نساعد الأسر المحتاجة في منطقة السعاتة الدومة من خلال توفير
                    الإغاثة الطارئة والتعليم والرعاية الصحية والمياه النظيفة.
                    نؤمن بأن كل شخص يستحق حياة كريمة وآمنة.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    رؤيتنا
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    نطمح إلى خلق مجتمع مستقر ومكتفي ذاتياً في منطقة السعاتة
                    الدومة، حيث يتمتع جميع السكان بالصحة والتعليم والفرص
                    الاقتصادية.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={teamImage}
                alt="فريق العمل"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              قيمنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              القيم التي توجه عملنا وتشكل هويتنا كمنظمة خيرية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              فريق العمل
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              فريق متخصص من الخبراء والمتطوعين المتفانين في خدمة المجتمع
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              إنجازاتنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              رحلة من الإنجازات والتقدم في خدمة أهالي السعاتة الدومة
            </p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                    {achievement.year}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              تأثيرنا على أرض الواقع
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              إحصائيات حقيقية عن تأثير عملنا في منطقة السعاتة الدومة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">2,500+</div>
              <div className="text-primary-100">أسرة مساعدة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
              <div className="text-primary-100">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">180</div>
              <div className="text-primary-100">متطوع نشط</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">1.25M</div>
              <div className="text-primary-100">جنيه سوداني</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            انضم إلينا في رحلة الخير
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            يمكنك المساهمة في عملنا من خلال التبرع أو التطوع أو مشاركة قصصنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate" className="btn-primary px-8 py-3 text-lg">
              تبرع الآن
            </Link>
            <Link to="/volunteer" className="btn-outline px-8 py-3 text-lg">
              تطوع معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
