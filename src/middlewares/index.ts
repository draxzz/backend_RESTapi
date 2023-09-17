import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../model/users.model';
import multer from 'multer';

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

/**
 * Middleware to check if the current user is the owner of a resource.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
export const isOwner = async(req: express.Request, res: express.Response,next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if(!currentUserId) {
            return res.status(403).send("Error: Not Logged In");
        }

        if(currentUserId.toString() !== id) {
            return res.status(403).send("Error: Not Owner");
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * Middleware to check if a user is authenticated.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 * @returns {Response<any, Record<string,any>>}
 */
export const isAuthenticated = async(req: express.Request, res: express.Response,next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[process.env.AUTH_KEY];
        
        if(!sessionToken) {
            return res.status(403).send("Error: Not Logged In");
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser) {
            return res.status(403).send("Error: Not Existing User");
        }
        console.log(req.cookies);
        merge(req, { identity: existingUser});

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * Middleware to check if the current user is an admin.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
export const isAdmin = async(req: express.Request, res: express.Response,next: express.NextFunction) => {
    try {
        const currentUserRole = req.cookies['role'];
        console.log('hi2');
        console.log(currentUserRole);
        if(currentUserRole !== "admin") {
            return res.status(403).send("Not Admin");
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// Configure the storage destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  // Create a multer instance with the configured storage
  export const upload = multer({ storage: storage });

