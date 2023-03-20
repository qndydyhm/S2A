import { Schema, Types, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export type View = {
    name: string;
    table: string;
    columns: string[];
    viewtype: string;
    allowedactions: number;
    roles: string[];
    filter?: string;
    userfilter?: string;
    editfilter?: string;
    editablecolumns?: string[],
    owner: string
    //   organization: Types.ObjectId;
}


// 2. Create a Schema corresponding to the document interface.
const viewSchema = new Schema<View>({
    name: { type: String, required: true },
    table: {type: String, required: true},
    columns: { type: [String], required: true },
    viewtype: { type: String, required: true },
    allowedactions: {type: Number, required: true},
    roles: {type: [String], required: true},
    filter: {type: String, required: false},
    userfilter: {type: String, required: false},
    editfilter: {type: String, required: false},
    editablecolumns: {type: [String], required: false},
    owner: {type: String, required: true}
    // And `Schema.Types.ObjectId` in the schema definition.
    //   organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

export default model('View', viewSchema)