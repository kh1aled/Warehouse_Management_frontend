import CrudService from "@/utils/crudFactory";
const userService = new CrudService('users');
export const getUsers = userService.getAll;
export const createUser = userService.create;
export const getUserById = userService.getById;
export const updateUserById = userService.update;
export const deleteUserById = userService.delete;
export const exportUsersPdf = userService.export;