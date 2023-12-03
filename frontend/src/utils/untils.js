export const IsJsonString = (data) => {
  try {
    if (data) {
        console.log("True day");
        return true
    }
    return false
  } catch (error) {
    return false;
  }
};

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
