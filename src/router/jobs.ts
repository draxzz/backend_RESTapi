import express from 'express';

import { applyJob, createJobs, deleteJob, getAllJobs, getAppliedJobs } from '../controllers/job';
import { isAdmin, isAuthenticated, isOwner, upload } from '../middlewares';

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job.
 *         description:
 *           type: string
 *           description: A description of the job.
 *         img:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               format: binary
 *               description: The image data (binary).
 *             contentType:
 *               type: string
 *               description: The content type of the image.
 *         active:
 *           type: string
 *           description: Whether the job is active or not.
 *         postedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the job was posted.
 *         company:
 *           type: string
 *           description: The name of the company offering the job.
 *         salary:
 *           type: number
 *           description: The salary for the job.
 */

export default (router: express.Router) => {
    /**
   * @swagger
   * /jobs:
   *   get:
   *     summary: Get a list of all jobs
   *     tags:
   *       - Jobs
   *     responses:
   *       '200':
   *         description: Successfully retrieved a list of jobs
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Job'
   *       '401':
   *         description: Unauthorized
   */
    router.get('/jobs', isAuthenticated ,getAllJobs);

    /**
     * @swagger
     * /jobs:
     *   post:
     *     summary: Create a new job
     *     tags:
     *       - Jobs
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               active:
     *                 type: string
     *               company:
     *                 type: string
     *               salary:
     *                 type: number
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       '201':
     *         description: Job successfully created
     *       '401':
     *         description: Unauthorized
     *       '403':
     *         description: Forbidden (requires admin)
     *     security:
     *       - BearerAuth: []
     */
    router.post('/jobs', isAuthenticated, isAdmin, upload.single('image'),createJobs);

    /**
   * @swagger
   * /jobs/apply-job/{jobId}:
   *   post:
   *     summary: Apply for a job
   *     tags:
   *       - Jobs
   *     parameters:
   *       - in: path
   *         name: jobId
   *         required: true
   *         description: ID of the job to apply for
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successfully applied for the job
   *       '401':
   *         description: Unauthorized
   */
    router.post('/jobs/apply-job/:jobId', isAuthenticated, applyJob);

    /**
   * @swagger
   * /jobs/{id}:
   *   delete:
   *     summary: Delete a job by ID
   *     tags:
   *       - Jobs
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the job to delete
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Job deleted successfully
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden (requires admin)
   */
    router.delete('/jobs/:id', isAuthenticated, deleteJob);

        /**
     * @swagger
     * /jobs/get-applied-jobs:
     *   get:
     *     summary: Get a list of jobs that the current user has applied for
     *     tags:
     *       - Jobs
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       '200':
     *         description: Successfully retrieved the list of applied jobs
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Job' # Reference to the Job schema
     *       '400':
     *         description: Bad request
     *       '403':
     *         description: Forbidden
     */
    router.get('/jobs/get-applied-jobs', isAuthenticated, getAppliedJobs);
};