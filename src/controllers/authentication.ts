import express from 'express';
import { createUser, getUserByEmail } from '../model/users.model';
import { random, authentication } from '../helpers';
// import dotenv from 'dotenv';
// import { generateToken } from 'util/jwt.utils';

/**
 * Login controller.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} The function returns void.
 * @throws {Error} Throws an error if there's a problem with the login process.
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email,password } = req.body;

        if(!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        
        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
        
        res.cookie(process.env.AUTH_KEY, user.authentication.sessionToken,
            { domain: 'localhost', path:'/'});

        res.cookie('role', user.role, {
            domain: 'localhost',
            path: '/',
        });
        res.cookie('id', user.id, {
            domain: 'localhost',
            path: '/',
        });
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * Register controller.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {void} The function returns void.
 * @throws {Error} Throws an error if there's a problem with the registration process.
 */
export const register = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password, firstName,lastName} = req.body;

        if(!email || !password || !firstName || !lastName) {
            return res.status(400).send("Invalid requirements");
        }
        const role = "admin";
        const existingUser = await getUserByEmail(email);
        
        if(existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            firstName,lastName, email,role, authentication:{ salt,password: authentication(salt,password)}
        });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}