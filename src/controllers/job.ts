import express from 'express';
import { createJob, deleteJobById, getJobById, getJobs } from '../model/job.model';
import { getUserById } from '../model/users.model';

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get a list of all jobs
 *     responses:
 *       '200':
 *         description: Successfully retrieved a list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
export const getAllJobs = async (req: express.Request, res: express.Response) => {
    try {
        const jobs = await getJobs();

        // // Convert the image data to base64
        // const jobsWithImages = jobs.map((job) => {
        //     const { title, description, active, postedAt, company, salary, owner, img } = job;
        //     console.log('hi1');
        //     console.log(img);
        //     return {
        //     title,
        //     description,
        //     active,
        //     postedAt,
        //     company,
        //     salary,
        //     owner,
        //     // Include the image data as base64 and contentType
        //     img: {
        //         data: img.data.toString('base64'),
        //         contentType: img.contentType,
        //     },
        //     };
        // });

        return res.status(200).json(jobs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job deleted successfully
 *       '403':
 *         description: Forbidden (job is not created by the user)
 *       '404':
 *         description: Job not found
 */
export const deleteJob = async(req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const userId = req.cookies['id'].toString();
        const ownerId = await getJobById(id);
        
        if(userId !== ownerId.owner) {
            return res.status(403).send("Job is not created by you");
        }

        const deletedJob = await deleteJobById(id);

        return res.status(200).json("Job deleted successfully");

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'  // Replace with your actual schema reference
 *     responses:
 *       '201':
 *         description: Job successfully created
 *       '400':
 *         description: Bad request
 */
export const createJobs = async(req: express.Request, res: express.Response) => {
    try {
        const { title, description, active, company, salary } = req.body;
        const img = req.file; 
        const ownerId = req.cookies['id'].toString();
        const postedAt = new Date();
        const imagePath = img ? img.path : null ;
        console.log('hi3');
        console.log(imagePath);

        if (isNaN(salary)) {
            return res.status(400).json({ error: 'Salary must be an integer.' });
        }
        
        const newJob = await createJob({title,description,active,postedAt,company,salary,owner:ownerId,img:imagePath});

        return res.status(201).json({message: "Job successfully created"});
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}

export const applyJob = async(req: express.Request, res: express.Response) => {
    try {
        const { jobId } = req.params;
        
        const userId = req.cookies['id'];
        
        const user = await getUserById(userId);
        
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.applied.push(jobId);
        await user.save();

        res.status(201).json({message: "Successfully applied for the job"});
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAppliedJobs = async (req: express.Request, res: express.Response) => {
    try {
        const userId = req.cookies['id'];
        
        const user = await getUserById(userId);
        const appliedJobs = user.applied;

        return res.status(200).json(appliedJobs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}