import CrudService from "@/utils/crudFactory";
const customerService = new CrudService('customers');
export const getCustomers = customerService.getAll;
export const createCustomer = customerService.create;
export const getCustomerById = customerService.getById;
export const updateCustomerById = customerService.update;
export const deleteCustomerById = customerService.delete;
export const exportCustomerPdf = customerService.export;