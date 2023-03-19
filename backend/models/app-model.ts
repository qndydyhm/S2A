import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type App = {
    name: string;
    creator: string;
    datasources: [string];
    views: [string];
    roleM: string;
    published: boolean;
    //   organization: Types.ObjectId;
}


// 2. Create a Schema corresponding to the document interface.
const appSchema = new Schema<App>({
    name: { type: String, required: true },
    creator: {type: String, required: true},
    datasources: { type: [String], required: true },
    views: { type: [String], required: true },
    roleM: { type: String, required: true },
    published: { type: Boolean, required: true }
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('App', appSchema)