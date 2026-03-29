import { stripMetadata } from "./stripMetadata";

export const cleanProductData = (data: any) => {
  const cleaned = stripMetadata(data);
  const result: any = {
    ...cleaned,
    categoryId:
      typeof cleaned.categoryId === "object" ? cleaned.categoryId?._id : cleaned.categoryId,
    brandId: typeof cleaned.brandId === "object" ? cleaned.brandId?._id : cleaned.brandId,
  };

  const optionalFields = ['discount', 'discountColor', 'badge', 'badgeColor', 'image'];
  optionalFields.forEach(field => {
    if (result[field] === "") {
      delete result[field];
    }
  });

  if (result.originalPrice === 0 || result.originalPrice === "") {
    delete result.originalPrice;
  }
  
  if (result.rating === 0 || result.rating === "") {
    delete result.rating;
  }

  return result;
};
