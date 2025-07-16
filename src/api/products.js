import CrudService from "@/utils/crudFactory";

const productService = new CrudService('products');
export const getProducts = productService.getAll;
export const getProductsWithPagination = productService.getProductsWithPagination;
export const createProduct = productService.create;
export const getProductById = productService.getById;
export const updateProductById = productService.update;
export const deleteProductById = productService.delete;
export const exportProductsPdf = productService.export;