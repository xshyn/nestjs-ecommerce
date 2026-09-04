export const CacheKeys = {
  product: (id: string) => `product:${id}`,
  productList: (version: number, query: string) =>
    `products:list:v${version}:${query}`,
};
