import CrudService from "@/utils/crudFactory";

const roleService = new CrudService('roles');

export const getRoles = roleService.getAll;
export const createRole = roleService.create;
export const getRoleById = roleService.getById;
export const updateRoleById = roleService.update;
export const deleteRoleById = roleService.delete;
export const exportRolesPdf = roleService.export;