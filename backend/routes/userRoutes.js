import express from 'express'

const router = express.Router()
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js'
import {protect, hasRole, ROLES} from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, hasRole(ROLES.Admin), getUsers)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, hasRole(ROLES.Admin), deleteUser)
    .get(protect, hasRole(ROLES.Admin), getUserById)
    .put(protect, hasRole(ROLES.Admin), updateUser)

export default router
