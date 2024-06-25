import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategories as fetchCategoriesFromAPI,
  updateCategory as updateCategoryByAPI,
  addCategory as createCategoryByAPI,
  deleteCategory as deleteCategoryByAPI,
  getAllCategories as fetchAllCategoriesFromAPI,
} from "../../Services/categoryServices";

const initialState = {
  categories: [],
  allCategories: [],
  categoriesStatus: "idle",
  allCategoriesStatus: "idle",
  categoriesError: null,
  allCategoriesError: null,
  totalPagesCount: 0,
};

// Thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ searchQuery, page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesFromAPI({
        searchQuery,
        page,
        limit,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching all categories
export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCategoriesFromAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for creating category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await createCategoryByAPI({ name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for updating category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryByAPI({ id, name });
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for deleting category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteCategoryByAPI({ id });
      return { id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch Filtered Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload.Categories;
        state.totalPagesCount = action.payload.count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      })

      // Fetch All Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.allCategoriesStatus = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.allCategoriesStatus = "succeeded";
        state.allCategories = action.payload.Categories;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.allCategoriesStatus = "failed";
        state.allCategoriesError = action.payload;
      })

      // Add
      .addCase(createCategory.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories.push(action.payload); // Adding the new category to the state
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      })

      // Update
      .addCase(updateCategory.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (category) => category._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload.id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      });
  },
});

export const selectAllCategories = (state) => state.categories.allCategories;
export const selectFilteredCategories = (state) => state.categories.categories;
export const getCategoriesStatus = (state) => state.categories.categoriesStatus;
export const getAllCategoriesStatus = (state) =>
  state.categories.allCategoriesStatus;
export const getCategoriesError = (state) => state.categories.categoriesError;
export const getAllCategoriesError = (state) =>
  state.categories.allCategoriesError;
export const getTotalPagesCount = (state) => state.categories.totalPagesCount;

export default categorySlice.reducer;
