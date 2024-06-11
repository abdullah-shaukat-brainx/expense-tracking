import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [{ name: "Food", id: "123" }],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getCategories: (state) => {
      return state.categories; // Ensure it returns the categories
    },
    addCategory: (state, action) => {
      const category = {
        name: action.payload.name,
        id: action.payload.id,
      };
      state.categories.push(category);
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload.id
      );
    },
    updateCategory: (state, action) => {
      const { id, name } = action.payload;
      const category = state.categories.find((cat) => cat.id === id);
      if (category) {
        category.name = name;
      }
    },
  },
});

export const { addCategory, removeCategory, updateCategory, getCategories } =
  categorySlice.actions;

export const selectCategories = (state) => state.categories.categories;

export default categorySlice.reducer;
