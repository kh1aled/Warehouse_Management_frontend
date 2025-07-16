import CrudService from "@/utils/crudFactory";

const employeeService = new CrudService('employees');

export const getEmployees = employeeService.getAll;
export const createEmployee = employeeService.create;
export const getEmployeeById = employeeService.getById;
export const updateEmployeeById = employeeService.update;
export const deleteEmployeeById = employeeService.delete;
