"use client";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useDispatch";
import { RootState } from "../store";
import { changePage } from "../store/product/slice";
import { fetchProducts } from "../store/product/thunk";
import { cn } from "@/src/lib/utils";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const dispatch = useAppDispatch();
  const { page, limit, search } = useSelector(
    (state: RootState) => state.product
  );

  const handlePageChange = (newPage: number) => {
    dispatch(changePage(newPage));
    dispatch(fetchProducts({ page: newPage, limit, search }));
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {[...Array(totalPages)].map((_, i) => {
        const p = i + 1;
        const isActive = page === p;

        return (
          <button
            key={i}
            onClick={() => handlePageChange(p)}
            className={cn(
              "w-10 h-10 rounded-xl font-semibold transition-all border text-sm",
              isActive
                ? "bg-white text-black border-white scale-110"
                : "bg-[#0F0F0F] text-[#555555] border-[#222222] hover:border-[#444444] hover:text-white"
            )}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
