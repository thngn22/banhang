import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slides/userSlide";
import authSlice from "./slides/authSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productSlice from "./slides/productSlice";
import categorySlice from "./slides/categorySlice";
import orderSlice from "./slides/orderSlice";
import accessSlice from "./slides/accessSlice";
import saleSlice from "./slides/saleSlice";

// Cấu hình Redux Persist cho slice 'auth'
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "user"], // chỉ lưu trữ slice 'auth'
};

const rootReducer = combineReducers({
  user: userSlice,
  auth: authSlice,
  product: productSlice,
  category: categorySlice,
  order: orderSlice,
  access: accessSlice,
  sale: saleSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
