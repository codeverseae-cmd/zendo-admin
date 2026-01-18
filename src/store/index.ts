import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./product/slice";
import categorySlice from "./category/slice";
import brandSlice from "./brand/slice";
import orderSlice from "./order/slice";
import authSlice  from "./auth/slice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    category: categorySlice,
    brand: brandSlice,
    order: orderSlice,
    auth: authSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
