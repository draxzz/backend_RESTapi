import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../model/users.model';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successfully retrieved a list of users
 *       '400':
 *         description: Bad request
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json({user:users,message:"Successfully retrieved a list of users"});
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile
 *       '400':
 *         description: Bad request
 */
export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUserById(req.cookies['id']);

        return res.status(200).json({user:users,message:"Successfully retrieved user profile"});
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted user
 *       '400':
 *         description: Bad request
 */
export const deleteUser = async(req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.status(200).json({message:"Successfully deleted user"});

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// export const updateUser = async(req: express.Request, res: express.Response) => { 
//     try {
//         const { id } = req.params;
//         const { username } = req.body;

//         if(!username) {
//             return res.sendStatus(400);
//         }

//         const user = await getUserById(id);

//         user.username = username;
//         await user.save();

//         return res.status(200).json(user).end();

//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }