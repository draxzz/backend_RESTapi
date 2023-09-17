import express from 'express';

import { login,register } from '../controllers/authentication'

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *         
 */


export default( router:express.Router) => {
    /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       '200':
   *         description: User registered successfully
   *       '400':
   *         description: Bad request
   */
    router.post('/auth/register',register);

    /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogin'
   *     responses:
   *       '200':
   *         description: User logged in successfully
   *       '401':
   *         description: Unauthorized
   *       '400':
   *         description: Bad request
   */
    router.post('/api/auth/login', login);
};