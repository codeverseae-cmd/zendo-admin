import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders, fetchSingleOrder, updateOrderStatus } from "./thunk";
import { Order, Pagination } from "./type";

interface OrderState {
  list: Order[];
  single: Order | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

const initialState: OrderState = {
  list: [],
  single: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load orders";
      })

      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.single = action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.single && state.single._id === action.payload._id) {
          state.single = action.payload;
        }
        state.list = state.list.map((o: Order) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export const { changePage } = orderSlice.actions;
export default orderSlice.reducer;
