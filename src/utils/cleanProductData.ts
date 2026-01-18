import { stripMetadata } from "./stripMetadata";

export const cleanProductData = (data: any) => {
  const cleaned = stripMetadata(data);
  return {
    ...cleaned,
    categoryId:
      typeof cleaned.categoryId === "object" ? cleaned.categoryId?._id : cleaned.categoryId,
    brandId: typeof cleaned.brandId === "object" ? cleaned.brandId?._id : cleaned.brandId,
  };
};

