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
export default formatShortNumberAr;
