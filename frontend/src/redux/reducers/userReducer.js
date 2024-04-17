const updateUser = (state, action) => {
    const { userName, email, phone, avatar, accessToken, isAdmin } = action.payload;
    console.log(action.payload);
    state.userName = userName;
    state.email = email;
    state.phone = phone;
    state.avatar = avatar;
    state.accessToken = accessToken;
    state.isAdmin = isAdmin
}

const addToCart = (state, action) => {
    const newItem = action.payload;

    const existingItem = state.cart.find(item => item.id === newItem.id && item.sizeBuy === newItem.sizeBuy && item.colorBuy === newItem.colorBuy);

    if (existingItem) {
      // Nếu có, cập nhật quantity
      existingItem.quantity += newItem.quantity;
      existingItem.price += newItem.price;
    } else {
      // Nếu không, thêm mới vào state.cart
      state.cart.push({ ...newItem, quantity: 1 });
    }
}

const updateQuantity = (state, action) => {
    const newItem = action.payload
    const itemIndex = state.cart.findIndex(item => item.id === newItem.id && item.sizeBuy === newItem.sizeBuy && item.colorBuy === newItem.colorBuy);
    state.cart[itemIndex] = newItem;

}

const removeItem = (state, action) => {
    const deleteItem = action.payload
    const itemIndex = state.cart.findIndex(item => item.id === deleteItem.id && item.sizeBuy === deleteItem.sizeBuy && item.colorBuy === deleteItem.colorBuy);
    state.cart.splice(itemIndex, 1)
}

const resetUser = (state) => {
    state.userName = '';
    state.email = '';
    state.phone = '';
    state.avatar = '';
    state.accessToken = '';
    state.isAdmin = false;
    state.cart = []
}
  
export const userReducer = {
    updateUser,
    addToCart,
    updateQuantity,
    removeItem,
    resetUser
}