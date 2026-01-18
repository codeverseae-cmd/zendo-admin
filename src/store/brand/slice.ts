import { createSlice } from "@reduxjs/toolkit";
import { fetchBrands, deleteBrand, createBrand, updateBrand } from "./thunk";

export interface BrandType {
  _id?: string;
  name: { en: string; ar: string };
}

interface BrandState {
  data: BrandType[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  data: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => { state.loading = true })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;   // backend → { success, data: [] }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.data = state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c._id !== action.payload);
      });
  },
});

export default brandSlice.reducer;
