import mongoose from 'mongoose';

export interface UserInput {
    email: string;
    name: string;
    password: string;
  }

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
  }


const UserSchema = new mongoose.Schema({
    firstName: { type:String, required:true},
    lastName: { type:String, required:true},
    email: { type:String, required:true},
    authentication:{
        password: { type:String,required:true,select:false},
        salt: { type:String,select:false },
        sessionToken: { type:String, select: false},
    },
    role: { type:String, required:true},
    applied: [{ type:String }]
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken});
export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values: Record<string,any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id:id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id,values); 
