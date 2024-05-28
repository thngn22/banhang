import dayjs from "dayjs";

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);
  return `${day}-${month}-${year} 00:00:00`;
};

export const formatDate = (type, value) => {
  if (!value) return "";
  switch (type) {
    case "year":
      return value ? dayjs(value).format("01-01-YYYY 00:00:00") : "";
    case "month":
      return value ? dayjs(value).format("01-MM-YYYY 00:00:00") : "";
    default:
      return value ? dayjs(value).format("DD-MM-YYYY 00:00:00") : "";
  }
};

export const formatDateEnd = (type, value) => {
  if (!value) return "";
  switch (type) {
    case "year":
      return value
        ? dayjs(value).endOf("year").format("DD-MM-YYYY 23:59:59")
        : "";
    case "month":
      return value
        ? dayjs(value).endOf("month").format("DD-MM-YYYY 23:59:59")
        : "";
    default:
      return value ? dayjs(value).format("DD-MM-YYYY 23:59:59") : "";
  }
};
