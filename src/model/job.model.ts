import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type:String, required:true},
    description: { type:String, required:true},
    // img: { data:Buffer, contentType: String },
    img: { type:String },
    active: { type:String, required:true },
    postedAt: { type:Date, required:true },
    company: { type:String, required:true },
    salary: { type:Number, required:true },
    owner: { type:String,required: true },
   
});

export const JobModel = mongoose.model('Job', JobSchema);
export const getJobs = () => JobModel.find();
export const getJobById = (id:string) => JobModel.findById(id);
export const createJob = (values: Record<string,any>) => new JobModel(values).save().then((job) => job.toObject());
export const deleteJobById = (id:string) => JobModel.findOneAndDelete({_id:id});