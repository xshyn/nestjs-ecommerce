export const CacheKeys = {
  product: (version: number, id: string) => `product:v${version}:${id}`,
  productList: (version: number, query: string) =>
    `products:list:v${version}:${query}`,
  blacklist: (jti: string) => `auth:blacklist:${jti}`,
  refresh: (jti: string) => `auth:refresh:${jti}`,
};
