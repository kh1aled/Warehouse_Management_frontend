import CrudService from "@/utils/crudFactory";

const brandService = new CrudService('brands');

export const getBrands = brandService.getAll;
export const getBrandById = brandService.getById;
export const createBrand = brandService.create;
export const updateBrandById = brandService.update;
export const deleteBrandById = brandService.delete;