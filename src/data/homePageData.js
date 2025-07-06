import image1 from "../assets/468500003_8770164286397663_795409730327188365_n.jpg";
import image2 from "../assets/468742514_8766108773469881_4524514268323846924_n.jpg";
import image3 from "../assets/481988533_9306874889393264_3406120898396487537_n.jpg";
import image4 from "../assets/475801362_1675287210537054_7479658673602311601_n.jpg";
import image5 from "../assets/488256335_9483793145034770_3893820036335481734_n.jpg";
import image6 from "../assets/488612872_4083956205257510_1041545498427009329_n.jpg";

export const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "متبرع",
    content:
      "أشعر بالسعادة عندما أرى تأثير تبرعاتي على أرض الواقع. أهالي السعاتة الدومة يستحقون كل مساعدة.",
    avatar: image1,
  },
  {
    id: 2,
    name: "فاطمة علي",
    role: "متطوعة",
    content:
      "التطوع مع هذه المنظمة كان تجربة رائعة. أرى التغيير الإيجابي في حياة الناس كل يوم.",
    avatar: image2,
  },
  {
    id: 3,
    name: "محمد حسن",
    role: "مستفيد",
    content:
      "شكراً لكم على مساعدتكم لنا. الآن أستطيع إرسال أطفالي إلى المدرسة وتوفير الطعام لهم.",
    avatar: image3,
  },
];

export const partners = [
  {
    id: 1,
    name: "UNICEF",
    logo: "/images/partners/unicef.png",
    website: "https://unicef.org",
  },
  {
    id: 2,
    name: "WHO",
    logo: "/images/partners/who.png",
    website: "https://who.int",
  },
  {
    id: 3,
    name: "Red Crescent",
    logo: "/images/partners/red-crescent.png",
    website: "https://ifrc.org",
  },
  {
    id: 4,
    name: "Save the Children",
    logo: "/images/partners/save-children.png",
    website: "https://savethechildren.org",
  },
];

export const statistics = {
  totalDonations: 1250000,
  familiesHelped: 2500,
  activeProjects: 15,
  volunteers: 180,
};

export const featuredStories = [
  {
    id: 1,
    title: "قصة أمينة: من اليأس إلى الأمل",
    excerpt:
      "كيف ساعدت التبرعات أمينة في إعادة بناء حياتها بعد فقدان منزلها في الفيضانات.",
    image: image4,
    category: "emergency",
    publishedAt: new Date("2024-01-15"),
    viewCount: 1250,
    likes: 89,
  },
  {
    id: 2,
    title: "مدرسة الأمل الجديدة",
    excerpt:
      "بناء مدرسة جديدة في السعاتة الدومة لتعليم 200 طفل محروم من التعليم.",
    image: image5,
    category: "education",
    publishedAt: new Date("2024-01-10"),
    viewCount: 980,
    likes: 67,
  },
  {
    id: 3,
    title: "عيادة صحية متنقلة",
    excerpt:
      "توفير الرعاية الصحية الأساسية لأكثر من 500 أسرة في المناطق النائية.",
    image: image6,
    category: "healthcare",
    publishedAt: new Date("2024-01-05"),
    viewCount: 756,
    likes: 45,
  },
  {
    id: 4,
    title: "مشروع المياه النظيفة",
    excerpt:
      "حفر آبار جديدة وتوفير المياه النظيفة لـ 300 أسرة في السعاتة الدومة.",
    image: image1,
    category: "water",
    publishedAt: new Date("2024-01-01"),
    viewCount: 1120,
    likes: 78,
  },
];