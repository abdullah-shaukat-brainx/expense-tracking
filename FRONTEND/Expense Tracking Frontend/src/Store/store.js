import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../Reducers/categories/categorySlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
});

export default store;
