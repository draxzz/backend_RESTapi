import express from 'express';
import authentication from './authentication';
import users from './users';
import jobs from './jobs';

const router = express.Router();

/**
 * Initializes and configures the main Express router for your application.
 *
 * @returns {express.Router} The configured Express router.
 */

export default (): express.Router => {

    // Configure routes from authentication, users, and jobs modules
    authentication(router);
    users(router);
    jobs(router);
    
    return router;
};