import CrudService from '@/utils/crudFactory'

const categoryService = new CrudService('categories')

export const getCategories = categoryService.getAll
export const createCategory = categoryService.create
export const getCategoryById = categoryService.getById
export const updateCategoryById = categoryService.update
export const deleteCategoryById = categoryService.delete
