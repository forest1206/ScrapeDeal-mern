import express from 'express'

const router = express.Router()
import {
    getCategories,
    createCategory,
    getCategoryById,
    deleteCategory,
    updateCategory,
} from '../controllers/categoryController.js'
import {protect, hasRole, ROLES} from '../middleware/authMiddleware.js'

router.route('/').get(getCategories).post(protect, hasRole(ROLES.Admin), createCategory)

router
    .route('/:id')
    .get(getCategoryById)
    .delete(protect, hasRole(ROLES.Admin), deleteCategory)
    .put(protect, hasRole(ROLES.Admin), updateCategory)

export default router
