import express from 'express';

import { deleteUser, getAllUsers, getUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

export default (router: express.Router) => {
    /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get a list of all users
   *     tags: [Users]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved a list of users
   *       '401':
   *         description: Unauthorized, user not logged in
   */
    router.get('/users', isAuthenticated ,getAllUsers);

    /**
   * @swagger
   * /users/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Users]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved user profile
   *       '401':
   *         description: Unauthorized, user not logged in
   */
    router.get('/users/profile', isAuthenticated ,getUser);

    /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID to delete
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: User deleted successfully
   *       '401':
   *         description: Unauthorized, user not logged in
   *       '403':
   *         description: Forbidden, user does not have permission
   *       '404':
   *         description: User not found
   */
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    
};