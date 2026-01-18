import { createSlice } from "@reduxjs/toolkit";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "./thunk";

export interface CategoryType {
  _id?: string;
  name: { en: string; ar: string };
  subCategories?: { name: string; items?: string[] }[];
}

interface CategoryStateType {
  data: CategoryType[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryStateType = {
  data: [],
  loading: false,
  error: null,
};



const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        state.data = state.data.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;