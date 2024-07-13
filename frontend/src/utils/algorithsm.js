const removeIdFromArray = (array, idToRemove) => {
  return array.filter((product) => product.id !== idToRemove);
};

const removeVietnameseTones = (str) => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
};

const algorithsm = {
  removeIdFromArray,
  removeVietnameseTones,
};

export default algorithsm;
