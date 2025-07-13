
// src/helpers/toArabicNumbers.js
const toArabicNumbers = (num) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return arabicNumbers[parseInt(digit)];
    }
    return digit;
  }).join('');
};

export default toArabicNumbers;
