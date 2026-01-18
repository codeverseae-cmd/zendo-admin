export const stripMetadata = (data: any) => {
    const { _id, createdAt, updatedAt, __v, ...rest } = data;
    return rest;
};
