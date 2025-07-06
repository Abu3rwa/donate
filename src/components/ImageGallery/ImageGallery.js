import React, { useState } from "react";

// Import all images
import image1 from "../../assets/468500003_8770164286397663_795409730327188365_n.jpg";
import image2 from "../../assets/468742514_8766108773469881_4524514268323846924_n.jpg";
import image3 from "../../assets/481988533_9306874889393264_3406120898396487537_n.jpg";
import image4 from "../../assets/475801362_1675287210537054_7479658673602311601_n.jpg";
import image5 from "../../assets/488256335_9483793145034770_3893820036335481734_n.jpg";
import image6 from "../../assets/488612872_4083956205257510_1041545498427009329_n.jpg";

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      src: image1,
      alt: "صورة من أعمال الإغاثة في السعاتة الدومة",
      title: "أعمال الإغاثة الطارئة",
      description: "توزيع المساعدات على الأسر المتأثرة",
    },
    {
      id: 2,
      src: image2,
      alt: "مشاريع التعليم في المنطقة",
      title: "مشاريع التعليم",
      description: "بناء المدارس وتوفير التعليم للأطفال",
    },
    {
      id: 3,
      src: image3,
      alt: "الرعاية الصحية المتنقلة",
      title: "الرعاية الصحية",
      description: "توفير الخدمات الطبية للمحتاجين",
    },
    {
      id: 4,
      src: image4,
      alt: "مشاريع المياه النظيفة",
      title: "مشاريع المياه",
      description: "حفر الآبار وتوفير المياه النظيفة",
    },
    {
      id: 5,
      src: image5,
      alt: "فريق العمل الميداني",
      title: "فريق العمل",
      description: "المتطوعون والعاملون في الميدان",
    },
    {
      id: 6,
      src: image6,
      alt: "المأوى الطارئ",
      title: "المأوى الطارئ",
      description: "توفير المأوى للأسر المتأثرة",
    },
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            معرض الصور
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            صور من أعمالنا الميدانية في منطقة السعاتة الدومة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => openModal(image)}
            >
              <div className="relative h-64">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-center">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
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
                    <span className="text-sm">انقر للتكبير</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {image.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-sm">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
