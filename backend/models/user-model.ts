import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type User = {
    name: string;
    email: string;
    profile: string;
    id: string;
    rtoken: string;
    atoken: string;
    expire: number;
    //   organization: Types.ObjectId;
}


// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profile: { type: String, required: true },
    id: { type: String, required: true },
    rtoken: { type: String, required: true },
    atoken: { type: String, required: true },
    expire: { type: Number, required: true },
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('User', userSchema)