import CrudService from "@/utils/crudFactory";

const supplierService = new CrudService('suppliers');

export const getSuppliers = supplierService.getAll;
export const createSupplier = supplierService.create;
export const getSupplierById = supplierService.getById;
export const updateSupplierById = supplierService.update;
export const deleteSupplierById = supplierService.delete;
export const exportSuppliersPdf = supplierService.export;
