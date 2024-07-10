const removeIdFromArray = (array, idToRemove) => {
  return array.filter((product) => product.id !== idToRemove);
};

const algorithsm = {
  removeIdFromArray,
};

export default algorithsm;
